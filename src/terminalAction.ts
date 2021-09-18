export const SET_TEXT = 'SET_TEXT' as const;
export const MKDIR = 'MKDIR' as const;
export const PWD = 'PWD' as const;
export const LS = 'LS' as const;
export const TOUCH = 'TOUCH' as const;
export const CD = 'CD' as const;
export const RM = 'RM' as const;

export const setText = (text: string) => ({
  type: SET_TEXT,
  payload: {
    text,
  },
});

export const mkdir = (dirName: string) => ({
  type: MKDIR,
  payload: { dirName },
});

export const pwd = () => ({
  type: PWD,
});

export const ls = () => ({
  type: LS,
});

export const touch = (fileName: string) => ({
  type: TOUCH,
  payload: { fileName },
});

export const cd = (path: string) => ({
  type: CD,
  payload: { path },
});

export const rm = (name: string) => ({
  type: RM,
  payload: { name },
});

export type TerminalActionTypes =
  | ReturnType<typeof setText>
  | ReturnType<typeof mkdir>
  | ReturnType<typeof pwd>
  | ReturnType<typeof ls>
  | ReturnType<typeof touch>
  | ReturnType<typeof cd>
  | ReturnType<typeof rm>;
