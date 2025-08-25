import {
  printallchildren,
  findNode,
  findRoot,
  findChildren,
} from "./operations.js";
import { buildTreeFromJson } from "./buildTree.js";

var current;

const titleElem = document.getElementById("title");

const basePath = `ketan@ketanhegde`;
const separator = ":";

var currentPath = buildPath(current);

var prevCommands = [];
var last = 0;

var isBot = false;

var inputValue = 0;

var terminalShown = true;

function moveCursorLR(value) {
  const input = document.getElementById("command");

  const cursor = input.nextElementSibling;

  const measurer = document.createElement("span");
  measurer.style.font = getComputedStyle(input).font;
  measurer.style.whiteSpace = "pre";
  measurer.style.visibility = "hidden";
  measurer.style.position = "absolute";

  measurer.textContent = value || "\u200b";
  document.body.appendChild(measurer);

  cursor.style.left = measurer.getBoundingClientRect().width * 1.04205 + "px";
  measurer.remove();
}

function setTitle(text) {
  titleElem.textContent = text;
}

function printAnswer(printText) {
  const shell = document.getElementById("shell");
  const output = document.createElement("p");
  output.id = "output";
  output.innerHTML = printText;
  output.style.whiteSpace = "pre";
  output.style.textWrap = "wrap";
  output.style.overflowWrap = "break-word";
  output.style.textAlign = "justify";
  shell.append(output);
}

function scrollToEnd() {
  const shell = document.getElementById("shell");
  shell.scrollTop = shell.scrollHeight;
}

function newPrompt() {
  currentPath = buildPath(current);

  const shell = document.getElementById("shell");

  const wrapper = document.createElement("div");
  wrapper.className = "display-path-command";

  const pathDiv = document.createElement("div");
  pathDiv.className = "pathDiv";

  if (isBot === false) {
    setTitle(basePath + separator + "~/" + currentPath);
    const basePathElem = document.createElement("p");
    basePathElem.textContent = basePath;
    const separatorElem = document.createElement("p");
    separatorElem.textContent = separator;
    const directoryPathElem = document.createElement("p");
    directoryPathElem.textContent = "~/" + currentPath;
    const dollarElem = document.createElement("p");
    dollarElem.textContent = "$";
    basePathElem.id = "basePath";
    separatorElem.id = "separator";
    directoryPathElem.id = "directoryPath";
    dollarElem.id = "dollar";

    const cmdBox = document.createElement("div");
    cmdBox.className = "command-container";

    const input = document.createElement("input");
    input.isDirectory = "text";
    input.className = "command";
    input.autofocus = true;
    input.name = "command";
    input.autocomplete = "off";
    input.id = "command";
    input.style.letterSpacing = "0.3px";
    input.autocapitalize = "none";
    input.autocorrect = "off";
    input.spellcheck = false;
    input.maxLength = 50;

    const cursor = document.createElement("div");
    cursor.id = "cursor";
    cursor.innerText = "";

    pathDiv.append(basePathElem, separatorElem, directoryPathElem, dollarElem);
    cmdBox.append(input, cursor);
    wrapper.append(pathDiv, cmdBox);
    shell.append(wrapper);
    input.addEventListener("keydown", (e) => {
      setTimeout(() => {
        handleKey(e);
      }, 0);
    });

    input.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });

    input.focus();
  } else {
    setTitle("ketanBot");
    const pathElem = document.createElement("p");
    pathElem.textContent = "ketanbot";
    pathElem.id = "basePath";
    const dollarElem = document.createElement("p");
    dollarElem.textContent = "$";
    dollarElem.id = "dollar";
    const cmdBox = document.createElement("div");
    cmdBox.className = "command-container";

    const input = document.createElement("input");
    input.isDirectory = "text";
    input.className = "command";
    input.autofocus = true;
    input.name = "command";
    input.autocomplete = "off";
    input.id = "command";
    input.style.letterSpacing = "0.3px";
    input.autocapitalize = "none";
    input.autocorrect = "off";
    input.spellcheck = false;
    input.maxLength = 100;

    const cursor = document.createElement("div");
    cursor.id = "cursor";
    cursor.innerText = "";

    pathDiv.append(pathElem, dollarElem);
    cmdBox.append(input, cursor);
    wrapper.append(pathDiv, cmdBox);

    shell.append(wrapper);
    input.addEventListener("keydown", (e) => {
      setTimeout(() => {
        handleKey(e);
      }, 0);
    });

    input.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });

    input.focus();
  }
}

function showLoading(shell) {
  const output = document.createElement("p");
  output.id = "output";
  output.style.whiteSpace = "pre";
  output.style.textWrap = "wrap";
  output.style.overflowWrap = "break-word";
  output.style.textAlign = "justify";
  shell.append(output);
  scrollToEnd();
  let dots = 0;
  setInterval(() => {
    dots = (dots + 1) % 6;
    output.textContent = "." + ".".repeat(dots);
  }, 200);
}

async function handleKey(e) {
  const input = e.target;
  e.preventDefault();
  setTimeout(() => {
    inputValue = input.selectionStart;
    moveCursorLR(input.value.slice(0, inputValue));
  }, 0);

  if (isBot === true && e.ctrlKey && e.key === "c") {
    const value = input.value;
    const cmdBox = input.parentElement;
    isBot = false;
    const echo = document.createElement("div");
    echo.textContent = value;
    echo.style.display = "inline";
    echo.style.whiteSpace = "pre";
    echo.style.color = "white";
    echo.style.fontSize = "14px";

    cmdBox.replaceChildren(echo);
    newPrompt();
    setTimeout(() => moveCursorLR(""), 0);
    e.preventDefault();
  }

  if (e.key === "Enter") {
    const value = input.value;
    const cmdBox = input.parentElement;

    const [cmd] = value.split(" ");

    const echo = document.createElement("div");
    echo.textContent = value;
    echo.style.display = "inline";
    echo.style.whiteSpace = "pre";
    echo.style.color = "white";
    echo.style.fontSize = "14px";

    cmdBox.replaceChildren(echo);

    if (isBot === false && cmd === "ketanbot") {
      isBot = true;

      printAnswer("\nHi there! Welcome to ketanBot.\n\n");
      printAnswer(
        "You can ask me about my education, experience, projects, and skills."
      );
      printAnswer(
        "To end the conversation, just say 'bye' or 'tata' to me.\n\n"
      );
    } else if (
      isBot === true &&
      (cmd === "exit" || cmd === "bye" || cmd === "tata")
    ) {
      printAnswer(
        "It was great talking with you! If you have any more questions later, feel free to reach out. Have a good day!\n\nBye\n\n"
      );

      isBot = false;
    } else if (isBot === true) {
      if (value !== "") {
        const shell = document.getElementById("shell");
        showLoading(shell);
        const response = await getResponse(value);
        shell.removeChild(shell.lastChild);
        var answer = response.answer;
        answer = answer.replace(/\*/g, "");
        answer += "\n\n";
        printAnswer(answer);
      }
    } else if (isBot === false) {
      if (value !== "") {
        decodeCommand(value);
      }
    }
    if (
      prevCommands.length === 0 ||
      prevCommands[prevCommands.length - 1] !== value
    ) {
      prevCommands.push(value);
      last = prevCommands.length;
    }

    newPrompt();
    setTimeout(() => moveCursorLR(""), 0);
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    if (last === 0) {
      e.preventDefault();

      if (prevCommands.length > 0) {
        if (input.value === prevCommands[0]) {
          input.setSelectionRange(input.value.length, input.value.length);
          return;
        } else {
          input.value = prevCommands[0];
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }
    } else if (last > 0) {
      e.preventDefault();
      last--;
      input.value = prevCommands[last];
      input.setSelectionRange(input.value.length, input.value.length);
      moveCursorLR(input.value);
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (last < prevCommands.length - 1) {
      last++;
      input.value = prevCommands[last];
      inputValue = input.value.length;
      moveCursorLR(input.value);
      input.setSelectionRange(inputValue, inputValue);
    }
  }
}

function decodeCommand(inputValue) {
  const [cmd, text] = inputValue.split(" ");
  let printText = "";
  if (cmd === "echo") {
    if (text) printText = text;
  } else if (cmd === "help") {
    printAnswer(
      "Use\n- ls to see all the files and folders in your current directory.\n- cd followed by a folder name to move into that directory.\n- cat followed by a filename to display the file’s content.\n- pwd to check the full path of where you currently are.\n(You can also use relative pathnames with commands like cd, ls, and cat to navigate)\n\nType `ketanbot` to start chatting with my bot\n\n"
    );
  } else if (cmd === "ls") {
    if (text && text !== "-a") {
      if (text === "-l") {
        const children = findChildren(current);
        const shell = document.getElementById("shell");
        for (let child of children) {
          if (child.isDirectory) {
            printText = `d rwx r -x r -x  1 ketan ketan  4096 Aug 10 10:30 ${child.name}`;
          } else {
            printText = ` - rw - r - - r - -  1 ketan ketan    ${
              child.content.length + 1
            } Aug 10 10:30 ${child.name}`;
          }
          const output = document.createElement("p");
          output.id = "output";
          output.textContent = printText;
          output.style.whiteSpace = "pre";
          shell.append(output);
        }
        return;
      }
      var node = findNode(current, text);
      if (node) {
        if (!node.isDirectory) {
          printText = text;
        } else {
          const childrenNames = printallchildren(node).join("      ");
          printText = childrenNames;
        }
      } else {
        printText = `bash: cd: ${text}: No such file or directory`;
      }
    } else {
      const childrenNames = printallchildren(current).join("      ");
      printText = childrenNames;
    }
  } else if (cmd === "cd") {
    if (text) {
      var node = findNode(current, text);
      if (node) {
        if (!node.isDirectory) {
          printText = `bash: cd: ${text}: Not a directory`;
        } else {
          current = node;
          currentPath = buildPath(current);
        }
      } else {
        printText = `bash: cd: ${text}: No such file or directory`;
      }
    } else {
      current = findRoot(current);
      currentPath = buildPath(current);
    }
  } else if (cmd == "cat") {
    if (text) {
      const child = findNode(current, text);
      if (child) {
        if (child.isDirectory) {
          printText = `cat: ${text}: Is a directory`;
        } else {
          if (child.content) printText = child.content;
        }
      } else {
        printText = `cat: ${text}: No such file or directory`;
      }
    }
  } else if (cmd == "date") printText = getFormattedDateTime();
  else if (cmd == "pwd") {
    printText = `/${currentPath}`;
  } else printText = cmd + ": command not found";
  printAnswer(printText);
}

async function getResponse(value) {
  try {
    const res = await fetch("https://ketanbot.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: value }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok " + res.statusText);
    }

    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

function buildPath(directory) {
  let path = [];
  let dir = directory;
  while (dir) {
    path.unshift(dir.name);
    dir = dir.parent;
  }
  return path.join("/");
}

function getFormattedDateTime() {
  const now = new Date();

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = weekdays[now.getDay()];
  const day = String(now.getDate()).padStart(2, "0");
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedTime = `${String(hours).padStart(
    2,
    "0"
  )}:${minutes}:${seconds} ${ampm}`;

  const ist = "IST";

  return `${dayName} ${day} ${monthName} ${year} ${formattedTime} ${ist}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("../data/data.json");
  const jsonData = await response.json();
  current = buildTreeFromJson(jsonData);
  currentPath = buildPath(current);
  printAnswer(
    "Type `help` to see available commands or `ketanbot` to start chatting with my bot.\n\n"
  );
  newPrompt();
});

document.addEventListener("mousedown", (e) => {
  e.preventDefault();
  const input = document.getElementById("command");
  if (document.activeElement !== input) {
    input.focus();
  }
});

const restoreBtn = document.getElementById("restore-button");
const shell = document.querySelector(".shell-outer-container");
const titleBar = document.getElementById("movable-box");
const titleBarInner = document.querySelector(".title-bar");
const shellInnerContainer = document.querySelector(".shell-inner-container");
const shellBorder = document.querySelector(".shell-border");
const singleBox = document.querySelector(".single-box");
const backBox = document.querySelector(".back-box");
const frontBox = document.querySelector(".front-box");
const mainContainer = document.querySelector(".main-container");

if (!restoreBtn || !shell || !titleBar || !mainContainer) {
  console.error("Required DOM elements missing. Check selectors.");
} else {
  let isMaximized = false;
  let isDragging = false;
  let fullScreenFlag = false;
  let offsetX = 0,
    offsetY = 0;
  let prevState = {};

  function savePrevState() {
    prevState = {
      left: shell.style.left || "",
      top: shell.style.top || "",
      width: shell.style.width || "",
      height: shell.style.height || "",
      margin: shell.style.margin || "",
      titleBarTL: titleBarInner.style.borderTopLeftRadius || "",
      titleBarTR: titleBarInner.style.borderTopRightRadius || "",
      innerBL: shellInnerContainer.style.borderBottomLeftRadius || "",
      innerBR: shellInnerContainer.style.borderBottomRightRadius || "",
      borderBL: shellBorder.style.borderBottomLeftRadius || "",
      borderBR: shellBorder.style.borderBottomRightRadius || "",
      borderMaxH: shellBorder.style.maxHeight || "",
      singleDisplay: singleBox.style.display || "",
      backDisplay: backBox.style.display || "",
      frontDisplay: frontBox.style.display || "",
    };
  }

  function applyPrevStateOrDefaults() {
    shell.style.width = prevState.width || "55vw";
    shell.style.height = prevState.height || "75%";
    shell.style.left = prevState.left || "";
    shell.style.top = prevState.top || "";
    shell.style.margin = prevState.margin || "auto";

    titleBarInner.style.borderTopLeftRadius = prevState.titleBarTL || "10px";
    titleBarInner.style.borderTopRightRadius = prevState.titleBarTR || "10px";
    shellInnerContainer.style.borderBottomLeftRadius =
      prevState.innerBL || "10px";
    shellInnerContainer.style.borderBottomRightRadius =
      prevState.innerBR || "10px";
    shellBorder.style.borderBottomLeftRadius = prevState.borderBL || "10px";
    shellBorder.style.borderBottomRightRadius = prevState.borderBR || "10px";
    shellBorder.style.maxHeight = prevState.borderMaxH || "70vh";

    singleBox.style.display = prevState.singleDisplay || "block";
    backBox.style.display = prevState.backDisplay || "none";
    frontBox.style.display = prevState.frontDisplay || "none";
  }

  function maximize() {
    if (isMaximized) return;
    savePrevState();

    shell.style.width = "99.85vw";
    shell.style.height = "100%";
    shell.style.left = "0px";
    shell.style.top = "0px";
    shell.style.margin = "0";

    titleBarInner.style.borderTopLeftRadius = "0px";
    titleBarInner.style.borderTopRightRadius = "0px";
    shellInnerContainer.style.borderBottomLeftRadius = "0px";
    shellInnerContainer.style.borderBottomRightRadius = "0px";
    shellBorder.style.borderBottomLeftRadius = "0px";
    shellBorder.style.borderBottomRightRadius = "0px";
    shellBorder.style.maxHeight = "92.15vh";

    singleBox.style.display = "none";
    backBox.style.display = "block";
    frontBox.style.display = "block";

    isMaximized = true;
  }

  function restore() {
    if (!isMaximized) return;
    applyPrevStateOrDefaults();
    isMaximized = false;
  }

  function toggleMaximize() {
    isMaximized ? restore() : maximize();
  }

  restoreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMaximize();
  });

  titleBar.addEventListener("dblclick", () => {
    toggleMaximize();
  });

  titleBar.addEventListener("mousedown", (e) => {
    if (isMaximized) return;

    isDragging = true;
    const shellRect = shell.getBoundingClientRect();
    offsetX = e.clientX - shellRect.left;
    offsetY = e.clientY - shellRect.top;
    titleBar.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const containerRect = mainContainer.getBoundingClientRect();
    const outerRect = shell.getBoundingClientRect();

    const newLeftViewport = e.clientX - offsetX;
    const newTopViewport = e.clientY - offsetY;

    let newLeft = newLeftViewport - containerRect.left;
    let newTop = newTopViewport - containerRect.top;

    if (newLeft < 0) newLeft = 0;
    const maxLeft = Math.max(0, containerRect.width - outerRect.width);
    if (newLeft > maxLeft) newLeft = maxLeft;

    if (newTop < 0) newTop = 0;
    const maxTop = Math.max(0, containerRect.height - outerRect.height);
    if (newTop > maxTop) newTop = maxTop;

    fullScreenFlag = newTop <= 0;

    if (fullScreenFlag) {
      mainContainer.style.backgroundImage = `linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0.3)), url("./images/wallpaper.png")`;
    } else {
      mainContainer.style.backgroundImage = `url("./images/wallpaper.png")`;
    }

    shell.style.left = `${newLeft}px`;
    shell.style.top = `${newTop}px`;
  });

  document.addEventListener("mouseup", (e) => {
    if (!isDragging) return;

    isDragging = false;
    titleBar.style.cursor = "initial";

    if (fullScreenFlag && !isMaximized) {
      maximize();
    }

    fullScreenFlag = false;
    mainContainer.style.backgroundImage = `url("./images/wallpaper.png")`;
  });

  window.addEventListener("resize", () => {
    const containerRect = mainContainer.getBoundingClientRect();
    const outerRect = shell.getBoundingClientRect();
    if (!isMaximized) {
      let left =
        parseFloat(shell.style.left) ||
        shell.getBoundingClientRect().left - containerRect.left;
      let top =
        parseFloat(shell.style.top) ||
        shell.getBoundingClientRect().top - containerRect.top;
      const maxLeft = Math.max(0, containerRect.width - outerRect.width);
      const maxTop = Math.max(0, containerRect.height - outerRect.height);
      if (left > maxLeft) shell.style.left = `${maxLeft}px`;
      if (top > maxTop) shell.style.top = `${maxTop}px`;
    }
  });
}

document
  .querySelector(".minimize-button")
  .addEventListener("click", function (e) {
    if (terminalShown) {
      shell.style.display = "none";
      document.querySelector(".terminal-icon-button").style.backgroundColor =
        "transparent";
      terminalShown = false;
    }
  });

document.querySelector(".close-button").addEventListener("click", function (e) {
  if (terminalShown) {
    current = findRoot(current);
    currentPath = buildPath(current);
    const shellElem = document.getElementById("shell");
    while (shellElem.firstChild) {
      shellElem.removeChild(shellElem.firstChild);
    }
    shell.style.display = "none";
    terminalShown = false;
    document.querySelector(".terminal-dot").style.display = "none";
    document.querySelector(".terminal-icon-button").style.backgroundColor =
      "transparent";
    isBot = false;
    printAnswer(
      "Welcome to my portfolio\n\nType `help` to see available commands or `ketanbot` to start chatting with my bot\n\n"
    );
    newPrompt();
  }
});

document
  .querySelector(".terminal-icon-button")
  .addEventListener("click", function (e) {
    if (!terminalShown) {
      shell.style.display = "flex";
      terminalShown = true;
      const input = document.getElementById("command");
      document.querySelector(".terminal-dot").style.display = "initial";
      document.querySelector(".terminal-icon-button").style.backgroundColor =
        "rgb(89, 89, 89)";
      input.focus();
    }
  });
