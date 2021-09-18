import { TerminalState } from './index.d';

// TODO: リファクタリング
export const getChildDirs = (
  terminalState: TerminalState,
  curDirPath: string,
): string[] => {
  const re1 = new RegExp(`^${curDirPath}/.+`);
  const re2 = new RegExp(`^${curDirPath}/`);
  const childDirs = Object.keys(terminalState.directories)
    .filter((dirPath) => {
      return re1.test(dirPath);
    })
    .map((filteredDirPath) => filteredDirPath.replace(re2, '').split('/')[0]);
  return Array.from(new Set(childDirs));
};
