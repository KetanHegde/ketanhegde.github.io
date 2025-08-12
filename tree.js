class Directory {
  constructor(name, bool, content) {
    this.parent = null;
    this.name = name;
    this.children = [];
    this.isDirectory = bool;
    this.content = content;
  }
}

export { Directory };
