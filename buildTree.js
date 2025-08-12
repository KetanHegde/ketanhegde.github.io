import { addChild } from "./operations.js";
import { Directory } from "./tree.js";

function buildTreeFromJson(jsonData) {
  const root = new Directory(
    jsonData.name,
    jsonData.isDirectory,
    jsonData.content
  );

  function addChildren(node, jsonNode) {
    if (!jsonNode.children) return;

    for (const child of jsonNode.children) {
      const newChild = addChild(
        node,
        child.name,
        child.isDirectory,
        child.content
      );
      addChildren(newChild, child);
    }
  }

  addChildren(root, jsonData);
  return root;
}

export { buildTreeFromJson };
