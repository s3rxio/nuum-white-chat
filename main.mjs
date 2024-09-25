/**
 *
 * @returns {import('./index').NuumUser}
 */
async function getUserData() {
  /**@type {{result:{import('./index').NuumUser}}} */
  const f = await (
    await fetch("https://nuum.ru/api/v2/profiles/current")
  ).json();

  return f.result;
}

/**@type {import('./index').MessageListenerCallback[]} */
const stack = [];

/**@type {import('./index').MessageListener} */
function setMessageListener(callback) {
  stack.push(callback);
}

async function main() {
  const user = await getUserData();

  const userLogin = user.user_profile.user_login.toLocaleLowerCase();

  const target = document.querySelector(".block__messages");

  const config = {
    childList: true,
    attributes: true,
    subtree: true,
  };

  const callback = (mutationList, observer) => {
    for (let mutation of mutationList) {
      if (mutation.type == "childList") {
        if (
          mutation.addedNodes.length &&
          mutation.addedNodes[0]?.classList?.contains("block__messages__item")
        ) {
          for (let callback of stack) {
            let msg = mutation.addedNodes[0]
              ?.querySelector(".message__body-text")
              ?.textContent.trim();
            if (!msg) return;
            callback(
              mutation.addedNodes[0]
                ?.querySelector(".header-username__link")
                ?.textContent.trim()
                .toLowerCase(),
              msg,
              mutation.addedNodes[0]
            );
          }
          // console.log(`new message
          //     nick: ${mutation.addedNodes[0].querySelector('.message__header-username.header-username').textContent.trim().toLowerCase()}
          //     content: ${mutation.addedNodes[0].querySelector('.message__body-text').textContent.trim()}`);
        }
      }
    }
  };

  const observer = new MutationObserver(callback);

  observer.observe(target, config);

  setMessageListener((author, msg, div) => {
    if (msg.toLocaleLowerCase().includes(userLogin)) {
      div.classList.add("user_ping");
    } else if (
      div.querySelector(".header-username__badge") &&
      div
        .querySelector(".header-username__badge")
        .textContent.toLocaleLowerCase()
        .trim() == "модератор"
    ) {
      div.querySelector(".header-username__badge").textContent = "";
      div.classList.add("moder_ping");
    }
  });

  // setMessageListener((author, msg, div) => {
  //     const frags = msg.split(' ');

  //     const urlExpression = /https?:\/\/([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9]{2,6}|([0-9]{1,3}\.){3}[0-9]{1,3})\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;;

  //     /**
  //      * @type {{
  //      *      type: 'text' | 'url'
  //      *      content: string
  //      * }[]}
  //      */
  //     const parsedFrags = [];

  //     for (let frag of frags) {
  //         if (frag.match(urlExpression)) {
  //             parsedFrags.push({
  //                 type: 'url',
  //                 content: frag
  //             })
  //         } else {
  //             parsedFrags.push({
  //                 type: 'text',
  //                 content: frag
  //             })
  //         }
  //     }

  //     let parsedMsg = '';

  //     for (let frag of parsedFrags) {
  //         if (frag.type == 'text') parsedMsg += ` ${frag.content}`;
  //         else if (frag.type == 'url') parsedMsg += ` <a href="${frag.content}" class="url_color_change">${frag.content}</a>`
  //     }

  //     div.querySelector('.message__body-text span').innerHTML = `<span>${parsedMsg}</span>`;
  //     console.log(div.querySelector('.message__body-text').childElementCount);
  //     for (;div.querySelector('.message__body-text').childElementCount > 1;) {
  //         console.log(
  //             div.querySelector('.message__body-text').removeChild()
  //         )
  //     }
  // });
}

const theme = {
  "--color-layer-background": "#f6f6f6",
  "--color-layer-second-transparent": "#00000030",
  "--color-layer-third-transparent": "#00000040",

  "--color-text-primary": "#000000",
  "--color-text-headline": "#00000090",

  "--color-control-secondary-default-transparent": "#00000010",
  "--color-control-secondary-hover-transparent": "#00000050",

  "--color-layer-zero": "#f6f6f6",
  "--color-layer-first": "#ffffff5c",
};

function setTheme() {
  const body = document.querySelector("body");

  Object.keys(theme).forEach((key) => {
    // console.log(`${key}:`, theme[key]);
    body.style.setProperty(key, theme[key]);
  });
}

setTheme();

setTimeout(main, 500);
