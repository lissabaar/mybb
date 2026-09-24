$(document).ready(function () {
  const CONFIG = {
    excludeForums: window.PR_FORUMS,
    charCountForums: window.PLAY_FORUMS,
    targetGroups: [1, 2, 5],
    topLimit: 30,
    maxTopics: 100,
    requestDelay: 500,
  };

  // Устанавливаем даты: с прошлой недели по вчера
  function setDefaultDates() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Начало периода: 7 дней назад от вчера
    const weekAgo = new Date(yesterday);
    weekAgo.setDate(yesterday.getDate() - 7);

    $("#stats-date-from").val(weekAgo.toISOString().split("T")[0]);
    $("#stats-date-to").val(yesterday.toISOString().split("T")[0]);
  }

  setDefaultDates();

  async function apiRequest(method, params) {
    try {
      const response = await $.post("/api.php", {
        method: method,
        ...params,
        format: "json",
      });
      return response;
    } catch (error) {
      console.error(`API Error [${method}]:`, error);
      return null;
    }
  }

  async function getUsers() {
    const userMap = new Map();

    for (const groupId of CONFIG.targetGroups) {
      try {
        const response = await apiRequest("users.get", {
          group_id: groupId,
          skip: 0,
          limit: 500,
          fields: "user_id,username",
        });

        if (response && response.response && response.response.users) {
          response.response.users.forEach((user) => {
            if (user && user.user_id && user.username) {
              userMap.set(parseInt(user.user_id), user.username);
            }
          });
          console.log(
            `Группа ${groupId}: +${response.response.users.length} пользователей`,
          );
        }

        await new Promise((resolve) =>
          setTimeout(resolve, CONFIG.requestDelay),
        );
      } catch (error) {
        console.log(`Группа ${groupId}: пропущена`);
      }
    }

    console.log(`Всего пользователей: ${userMap.size}`);
    return userMap;
  }

  async function getTopicsFromForums(forumIds, label) {
    let allTopics = [];
    const dateFrom = new Date($("#stats-date-from").val());
    const fromTimestamp = Math.floor(dateFrom.getTime() / 1000);

    for (const forumId of forumIds) {
      let hasMore = true;
      let skip = 0;

      while (hasMore && allTopics.length < CONFIG.maxTopics) {
        const response = await apiRequest("topic.get", {
          forum_id: forumId,
          skip: skip,
          limit: 100,
          sort_by: "last_post",
          sort_dir: "desc",
          fields: "id,subject,forum_id,last_post_date",
        });

        if (response && response.response && Array.isArray(response.response)) {
          const topics = response.response;

          const recentTopics = topics.filter(
            (topic) =>
              topic &&
              topic.last_post_date &&
              topic.last_post_date >= fromTimestamp,
          );

          allTopics = allTopics.concat(recentTopics);
          skip += 100;

          const lastTopic = topics[topics.length - 1];
          if (
            !lastTopic ||
            !lastTopic.last_post_date ||
            lastTopic.last_post_date < fromTimestamp
          ) {
            hasMore = false;
          }

          await new Promise((resolve) =>
            setTimeout(resolve, CONFIG.requestDelay),
          );
        } else {
          hasMore = false;
        }
      }
    }

    console.log(`${label}: ${allTopics.length} тем`);
    return allTopics
      .sort((a, b) => (b.last_post_date || 0) - (a.last_post_date || 0))
      .slice(0, CONFIG.maxTopics);
  }

  async function getPosts(topicId, dateFrom, dateTo) {
    const fromTimestamp = Math.floor(dateFrom.getTime() / 1000);
    const toTimestamp = Math.floor(dateTo.getTime() / 1000) + 86400;

    const response = await apiRequest("post.get", {
      topic_id: topicId,
      skip: 0,
      limit: 100,
      sort_by: "posted",
      sort_dir: "desc",
      fields: "id,user_id,username,message,posted,topic_id",
    });

    if (response && response.response && Array.isArray(response.response)) {
      return response.response.filter(
        (post) =>
          post &&
          post.posted &&
          post.posted >= fromTimestamp &&
          post.posted <= toTimestamp,
      );
    }

    return [];
  }

  async function calculate() {
    const dateFrom = new Date($("#stats-date-from").val());
    const dateTo = new Date($("#stats-date-to").val());

    if (isNaN(dateFrom.getTime()) || isNaN(dateTo.getTime())) {
      alert("Выберите даты!");
      return;
    }

    if (dateFrom > dateTo) {
      alert('Дата "С" должна быть раньше даты "По"!');
      return;
    }

    $("#stats-calculate").prop("disabled", true);
    $("#stats-loading").show();
    $("#stats-progress").show();
    $("#stats-results").hide();

    try {
      $("#stats-loading").text("Получаем список пользователей...");
      const targetUsers = await getUsers();

      if (targetUsers.size === 0) {
        alert("Не удалось получить список пользователей.");
        return;
      }

      $("#stats-loading").text("Получаем список форумов...");
      const allForumsResponse = await apiRequest("board.getForums", {});
      let forumsForPosts = [];

      if (
        allForumsResponse &&
        allForumsResponse.response &&
        Array.isArray(allForumsResponse.response)
      ) {
        forumsForPosts = allForumsResponse.response.filter(
          (forum) =>
            forum &&
            forum.id &&
            !CONFIG.excludeForums.includes(parseInt(forum.id)),
        );
      }

      const forumIdsForPosts = forumsForPosts.map((f) => parseInt(f.id));
      console.log(
        `Форумы для постов (${forumIdsForPosts.length}): ${forumIdsForPosts.join(", ")}`,
      );

      $("#stats-loading").text("Получаем темы для подсчета постов...");
      const topicsForPosts = await getTopicsFromForums(
        forumIdsForPosts,
        "Темы для постов",
      );

      $("#stats-loading").text("Получаем темы для символов...");
      const topicsForChars = await getTopicsFromForums(
        CONFIG.charCountForums,
        "Темы для символов",
      );

      const postCount = {};
      const charCount = {};
      const topicActivity = {};

      for (let i = 0; i < topicsForPosts.length; i++) {
        const topic = topicsForPosts[i];
        const progress = Math.round(((i + 1) / topicsForPosts.length) * 100);

        $("#stats-loading").text(
          `Посты: тема ${i + 1}/${topicsForPosts.length}`,
        );
        $("#stats-progress-bar").css("width", progress + "%");

        const posts = await getPosts(topic.id, dateFrom, dateTo);

        posts.forEach((post) => {
          const userId = parseInt(post.user_id);

          if (targetUsers.has(userId) && post.username) {
            postCount[userId] = (postCount[userId] || 0) + 1;
          }
        });

        await new Promise((resolve) =>
          setTimeout(resolve, CONFIG.requestDelay),
        );
      }

      for (let i = 0; i < topicsForChars.length; i++) {
        const topic = topicsForChars[i];
        const progress = Math.round(((i + 1) / topicsForChars.length) * 100);

        $("#stats-loading").text(
          `Символы: тема ${i + 1}/${topicsForChars.length}`,
        );
        $("#stats-progress-bar").css("width", progress + "%");

        const posts = await getPosts(topic.id, dateFrom, dateTo);

        posts.forEach((post) => {
          const userId = parseInt(post.user_id);

          if (targetUsers.has(userId) && post.username) {
            if (post.message) {
              const cleanMessage = post.message.replace(/<[^>]*>/g, "").trim();
              charCount[userId] =
                (charCount[userId] || 0) + cleanMessage.length;
            }

            const topicKey = post.topic_id;
            if (!topicActivity[topicKey]) {
              topicActivity[topicKey] = {
                subject: topic.subject || `Тема #${post.topic_id}`,
                count: 0,
              };
            }
            topicActivity[topicKey].count++;
          }
        });

        await new Promise((resolve) =>
          setTimeout(resolve, CONFIG.requestDelay),
        );
      }

      displayResults(targetUsers, postCount, charCount, topicActivity);
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Произошла ошибка при подсчете статистики");
    } finally {
      $("#stats-calculate").prop("disabled", false);
      $("#stats-loading").hide();
      $("#stats-progress").hide();
    }
  }

  function displayResults(targetUsers, postCount, charCount, topicActivity) {
    // Топ по количеству сообщений
    const topPosters = Object.entries(postCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, CONFIG.topLimit)
      .map(([userId, count]) => ({
        userId: userId,
        username: targetUsers.get(parseInt(userId)) || "ID:" + userId,
        count: count,
      }));

    let postersHTML = topPosters.length > 0 ? "<ol>" : "<p>Нет данных</p><ol>";
    topPosters.forEach((user) => {
      postersHTML += `<li><a href="/profile.php?id=${user.userId}"><strong>${user.username}</strong></a>: ${user.count} сообщ.</li>`;
    });
    postersHTML += "</ol>";
    $("#top-posters-list").html(postersHTML);

    // Топ по символам
    const topChars = Object.entries(charCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, CONFIG.topLimit)
      .map(([userId, count]) => ({
        userId: userId,
        username: targetUsers.get(parseInt(userId)) || "ID:" + userId,
        count: count,
      }));

    let charsHTML = topChars.length > 0 ? "<ol>" : "<p>Нет данных</p><ol>";
    topChars.forEach((user) => {
      charsHTML += `<li><a href="/profile.php?id=${user.userId}"><strong>${user.username}</strong></a>: ${user.count.toLocaleString()} симв.</li>`;
    });
    charsHTML += "</ol>";
    $("#top-chars-list").html(charsHTML);

    // Самые активные эпизоды
    const topTopics = Object.entries(topicActivity)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, CONFIG.topLimit)
      .map(([topicId, data]) => ({
        topicId: topicId,
        subject: data.subject,
        count: data.count,
      }));

    let topicsHTML = topTopics.length > 0 ? "<ol>" : "<p>Нет данных</p><ol>";
    topTopics.forEach((topic) => {
      topicsHTML += `<li><a href="/viewtopic.php?id=${topic.topicId}" target="_blank">${topic.subject}</a>: ${topic.count} сообщ.</li>`;
    });
    topicsHTML += "</ol>";
    $("#top-topics-list").html(topicsHTML);

    $("#stats-results").show();
  }

  $("#stats-calculate").click(function () {
    calculate();
  });
});
