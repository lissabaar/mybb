// Быстрое копирование ссылки на пост
// 05.08.2022 скрипт от goyangi
// последняя модификация от 15.06.2026

if ($("#pun-viewtopic").length) {
  function initPermalinkHandler() {
    $(".permalink").each(function () {
      if (!$(this).hasClass("permalink-copy-handler-added")) {
        $(this).attr("link", $(this).attr("href"));
        $(this).removeAttr("href");

        $(this).addClass("permalink-copy-handler-added");
        let $parentSpan = $(this).closest("span");
        let $msg = $parentSpan.next(".copy-post-msg");

        if ($msg.length === 0) {
          $msg = $(
            '<span class="copy-post-msg" style="display: none; background: #00000010; padding: 3px 10px; margin-left: 10px">скопировано</span>',
          );
          $parentSpan.after($msg);
        }

        $(this).on("click", function (e) {
          e.preventDefault();

          let $post = $(this).closest(".post");
          let postIdAttr = $post.attr("id");

          if (!postIdAttr || !postIdAttr.match(/^p\d+$/)) return;

          let postId = postIdAttr.substring(1);

          let newLink = `https://${document.location.host}/viewtopic.php?pid=${postId}#p${postId}`;

          let $parentSpan = $(this).closest("span");
          let $msg = $parentSpan.next(".copy-post-msg");

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
              .writeText(newLink)
              .then(() => {
                $msg
                  .text("скопировано")
                  .stop(true, true)
                  .fadeIn(300)
                  .delay(1500)
                  .fadeOut(300);

                history.replaceState(null, "", newLink);
              })
              .catch(() => {
                $msg
                  .text("ошибка")
                  .stop(true, true)
                  .fadeIn(300)
                  .delay(1500)
                  .fadeOut(300);
              });
          } else {
            // fallback для старых браузеров
            let textarea = document.createElement("textarea");
            textarea.value = newLink;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);

            $msg
              .text("скопировано")
              .stop(true, true)
              .fadeIn(300)
              .delay(1500)
              .fadeOut(300);
            history.replaceState(null, "", newLink);
          }
        });
      }
    });
  }

  $(document).ready(() => {
    initPermalinkHandler();
  });

  $(document).ajaxSuccess(function () {
    initPermalinkHandler();
  });
}
