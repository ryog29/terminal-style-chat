import { Directory, TerminalState } from './index.d';
import { getChildDirs } from './selector';
import {
  CD,
  LS,
  MKDIR,
  PWD,
  RM,
  SET_TEXT,
  TerminalActionTypes,
  TOUCH,
} from './terminalAction';

export const createDirs = (
  terminalState: TerminalState,
  dirNames: string[],
): [{ [key: string]: Directory }, string[]] => {
  const filteredDirNames: string[] = [];
  const errMsges: string[] = [];
  dirNames.forEach((dirName) => {
    const dirExists = Object.keys(terminalState.directories).includes(
      `${terminalState.curDirPath}/${dirName}`,
    );
    if (dirExists) {
      errMsges.push(`mkdir: ${dirName}: File exists`);
    } else {
      filteredDirNames.push(dirName);
    }
  });
  const dirs = filteredDirNames.reduce(
    (dirs: { [key: string]: Directory }, dirName: string) => {
      dirs[`${terminalState.curDirPath}/${dirName}`] = {
        name: dirName,
        files: {},
      };
      return dirs;
    },
    {},
  );
  return [dirs, errMsges];
};

export const appReducer = (
  terminalState: TerminalState,
  action: TerminalActionTypes,
): TerminalState => {
  switch (action.type) {
    case SET_TEXT: {
      return {
        ...terminalState,
        lineText: [...terminalState.lineText, action.payload.text],
      };
    }
    case MKDIR: {
      const [dirs, errMsges] = createDirs(
        terminalState,
        action.payload.dirNames,
      );
      if (errMsges.length !== 0) {
        return {
          ...terminalState,
          lineText: [...terminalState.lineText, ...errMsges],
          directories: {
            ...terminalState.directories,
            ...dirs,
          },
        };
      } else {
        return {
          ...terminalState,
          directories: {
            ...terminalState.directories,
            ...dirs,
          },
        };
      }
    }
    case TOUCH: {
      if (
        Object.keys(
          terminalState.directories[terminalState.curDirPath].files,
        ).includes(action.payload.fileName)
      ) {
        // TODO: タイムスタンプ更新
        return terminalState;
      } else {
        return {
          ...terminalState,
          directories: {
            ...terminalState.directories,
            [terminalState.curDirPath]: {
              ...terminalState.directories[terminalState.curDirPath],
              files: {
                ...terminalState.directories[terminalState.curDirPath].files,
                [action.payload.fileName]: {
                  ...terminalState.directories[terminalState.curDirPath].files[
                    action.payload.fileName
                  ],
                },
              },
            },
          },
        };
      }
    }
    case PWD: {
      return {
        ...terminalState,
        lineText: [...terminalState.lineText, terminalState.curDirPath],
      };
    }
    case LS: {
      const childDirsName = getChildDirs(
        terminalState,
        terminalState.curDirPath,
      );
      return {
        ...terminalState,
        lineText: [
          ...terminalState.lineText,
          ...Object.keys(
            terminalState.directories[terminalState.curDirPath].files,
          ),
          ...childDirsName,
        ],
      };
    }
    case CD: {
      if (action.payload.path === '..' && terminalState.curDirPath !== '~') {
        return {
          ...terminalState,
          curDirPath: terminalState.curDirPath
            .split('/')
            .slice(0, -1)
            .join('/'),
        };
      }
      if (
        Object.keys(terminalState.directories).includes(
          `${terminalState.curDirPath}/${action.payload.path}`,
        )
      ) {
        return {
          ...terminalState,
          curDirPath: `${terminalState.curDirPath}/${action.payload.path}`,
        };
      } else {
        const errMsg = `cd: no such file or directory: ${action.payload.path}`;
        return {
          ...terminalState,
          lineText: [...terminalState.lineText, errMsg],
        };
      }
    }
    case RM: {
      if (
        Object.keys(
          terminalState.directories[terminalState.curDirPath].files,
        ).includes(action.payload.name)
      ) {
        const { [action.payload.name]: _removed, ...files } =
          terminalState.directories[terminalState.curDirPath].files;
        return {
          ...terminalState,
          directories: {
            ...terminalState.directories,
            [terminalState.curDirPath]: {
              ...terminalState.directories[terminalState.curDirPath],
              files,
            },
          },
        };
      } else {
        const errMsg = `rm: ${action.payload.name}: No such file or directory`;
        return {
          ...terminalState,
          lineText: [...terminalState.lineText, errMsg],
        };
      }
    }
    default:
      return terminalState;
  }
};
