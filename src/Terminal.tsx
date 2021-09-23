import React, { useEffect, useReducer } from 'react';
import { Command, TerminalState } from './index.d';
import {
  cd,
  CD,
  ls,
  LS,
  mkdir,
  MKDIR,
  pwd,
  PWD,
  rm,
  RM,
  setText,
  TerminalActionTypes,
  touch,
  TOUCH,
} from './terminalAction';
import { appReducer } from './terminalReducer';
import './Terminal.css';

// 実装済み
// ls
// touch
// mkdir
// pwd
// cd
// rm

// 未実装
// man
// login
// cat
// tree
// echo
// mv
// cp
// オプション引数
// パイプ機能
// 入力補完機能
// カレントディレクトリの表示
// localStorage
// テスト
// 日本語入力回避
// 画面の一番下まで行ったら自動スクロール
// 連続するパスに対応 (ex: cd hoge/foo/bar)

const initialState: TerminalState = {
  lineText: [],
  curDirPath: '~',
  directories: {
    '~': {
      name: '~',
      files: {},
    },
  },
};

const parseCommand = (inputText: String): Command => {
  const splittedText = inputText.trim().split(' ');
  const command = splittedText.reduce(
    (com: Command, text, index) => {
      if (index === 0) {
        return {
          ...com,
          name: text,
        };
      }
      if (text[0] === '-') {
        return {
          ...com,
          options: [...com.options, ...text.slice(1).split('')],
        };
      }
      return { ...com, args: [...com.args, text] };
    },
    { name: '', args: [], options: [] },
  );
  return command;
};

const dispatchCommand = (
  dispatch: React.Dispatch<TerminalActionTypes>,
  command: Command,
) => {
  switch (command.name) {
    case MKDIR:
      // TODO: -p オプションで親ディレクトリもまとめて作成する
      // TODO: 同じ名前の引数を複数与えた時にエラーメッセージを表示する
      dispatch(mkdir(command.args));
      break;
    case TOUCH: //TODO: 空文字対策
      dispatch(touch(command.args[0]));
      break;
    case PWD:
      dispatch(pwd());
      break;
    case LS:
      dispatch(ls());
      break;
    case CD:
      dispatch(cd(command.args[0]));
      break;
    case RM:
      dispatch(rm(command.args[0]));
      break;
    default:
      dispatch(setText(`command not found: ${command.name}`));
      break;
  }
};

const Terminal: React.FC = () => {
  const [terminalState, dispatch] = useReducer(appReducer, initialState);

  const keyDownHandler = (event: any) => {
    if (event.key === 'Enter') {
      dispatch(setText(`>${event.target.value}`));
      const parsedCommand = parseCommand(event.target.value);
      dispatchCommand(dispatch, parsedCommand);
      event.target.value = '';
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
  }, []);

  return (
    <div className="terminal">
      {terminalState.lineText.map((text, i) =>
        text.startsWith('>') ? (
          <p key={i} className="displayLine">
            <span className="rightAngleBracket">&gt;</span>
            {text.slice(1)}
          </p>
        ) : (
          <p key={i} className="displayLine">
            {text}
          </p>
        ),
      )}
      <div className="displayLine">
        <span className="rightAngleBracket">&gt;</span>
        <input autoFocus type="text" />
      </div>
    </div>
  );
};

export default Terminal;
