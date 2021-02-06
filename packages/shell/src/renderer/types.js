// state
export const D = "D";
export const user = "user";

export const INIT_APP = 'INIT_APP'
export const UPDATE_USER = 'UPDATE_USER'
export const LOGOUT = 'LOGOUT'

export const C_Default = "#1c2438";
export const C_Info = "#2d8cf0";
export const C_Success = "#19be6b";
export const C_Normal = "#1c2438";
export const C_Warning = "#ff9900";
export const C_Error = "#ed3f14";

export const autoSetBrowserViewBounds = ({ browserWidth, browserHeight, browserX, browserY }) => {
  console.info(`autoSetBrowserViewBounds w:${browserWidth}, h:${browserHeight}, x:${browserX}, y:${browserY}`)

  chrome.tabs.onAction('setViewBounds', {
    x: browserX,
    y: browserY,
    width: browserWidth,
    height: browserHeight
  });
}
