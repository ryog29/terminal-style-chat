import { TerminalState } from './index.d';
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
      if (
        Object.keys(terminalState.directories).includes(
          `${terminalState.curDirPath}/${action.payload.dirName}`,
        )
      ) {
        const errMsg = `mkdir: ${action.payload.dirName}: File exists`;
        return {
          ...terminalState,
          lineText: [...terminalState.lineText, errMsg],
        };
      } else {
        return {
          ...terminalState,
          directories: {
            ...terminalState.directories,
            [`${terminalState.curDirPath}/${action.payload.dirName}`]: {
              name: action.payload.dirName,
              files: {},
            },
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
