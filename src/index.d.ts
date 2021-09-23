export type TerminalState = {
  lineText: string[];
  curDirPath: string;
  directories: { [key: string]: Directory };
};

export type Directory = {
  name: string;
  files: { [key: string]: File };
};

export type File = {
  name: string;
  contents: string;
};

export type Command = {
  name: string;
  args: string[];
  options: string[];
};
