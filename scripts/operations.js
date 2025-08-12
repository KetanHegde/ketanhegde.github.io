import { Directory } from "./tree.js";

const addChild = (current, name, bool, content) => {
  const child = new Directory(name, bool);
  child.parent = current;
  current.children.push(child);
  child.content = content;
  return child;
};

const printallchildren = (current) => {
  const children = current.children.map((child) => child.name);
  return children;
};

const findChildren = (current) => {
  return current.children;
};

const findChild = (current, name) => {
  const child = current.children.find((child) => child.name === name);
  return child || null;
};

const findParent = (current) => {
  return current.parent ? current.parent : current;
};

const findNode = (current, path) => {
  const nodes = path.split("/");
  var temp = current;
  var flag = false;
  for (let node of nodes) {
    if (node.trim() !== "") {
      flag = true;
      if (node === "..") {
        temp = findParent(temp);
      } else if (node === ".") {
        temp = temp;
      } else {
        temp = findChild(temp, node);
        if (!temp) return;
      }
    }
  }
  if (!flag) return findRoot(current);
  return temp;
};

const findRoot = (current) => {
  while (current.parent != null) {
    current = current.parent;
  }
  return current;
};

export { addChild, printallchildren, findNode, findRoot, findChildren };
