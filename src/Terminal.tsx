import React, { useEffect, useReducer } from 'react';
import { TerminalState } from './index.d';
import {
  cd,
  ls,
  mkdir,
  pwd,
  rm,
  setText,
  TerminalActionTypes,
  touch,
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
// オプション引数
// パイプ機能
// 入力補完機能
// カレントディレクトリの表示
// localStorage
// テスト
// 日本語入力回避
// 画面の一番下まで行ったら自動スクロール

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

// TODO: オプション引数のパース
const parseCommand = (inputText: String): string[] => {
  return inputText.trim().split(' ');
};

const dispatchCommand = (
  dispatch: React.Dispatch<TerminalActionTypes>,
  parsedCommand: string[],
) => {
  switch (parsedCommand[0]) {
    case 'mkdir':
      dispatch(mkdir(parsedCommand[1]));
      break;
    case 'touch': //TODO: 空文字対策
      dispatch(touch(parsedCommand[1]));
      break;
    case 'pwd':
      dispatch(pwd());
      break;
    case 'ls':
      dispatch(ls());
      break;
    case 'cd':
      dispatch(cd(parsedCommand[1]));
      break;
    case 'rm':
      dispatch(rm(parsedCommand[1]));
      break;
    default:
      dispatch(setText(`command not found: ${parsedCommand[0]}`));
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
