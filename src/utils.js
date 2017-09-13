import safeEval from 'notevil';
import * as excelFunctions from '@quantlab/formulajs';

const DRIVE_CLIENT_ID = '351320810462-njnoadgob9iob496n7qbjnlvtm23aa5e.apps.googleusercontent.com';
const DRIVE_API_KEY = 'AIzaSyAYz2ApIojoyHXgFChCberS4Rps_GLt19E';
const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file'];

export function toRow(n) {
  return String.fromCharCode('A'.charCodeAt(0) + n);
}

const formulaNames = Object.keys(excelFunctions);

export const getFormulas = text => formulaNames.filter(name => name.includes(text.replace(/^=/, '').toUpperCase()));

export function toId(coords) {
  if (!coords) {
    return undefined;
  }
  return toRow(coords.x) + coords.y;
}

export function getValue(expression, context) {
  if (!expression) {
    return '';
  }
  try {
    return safeEval(expression.replace(/^=/, ''), Object.assign({}, context, excelFunctions));
  } catch (e) {
    return expression;
  }
}

export const isExpression = v => !!(v || '').toString().match(/^=/);

export function parseInput(value) {
  const n = parseFloat(value, 10);
  if (isNaN(n)) {
    return value;
  }
  return n;
}

export function buildCSV(width, height, data) {
  const rows = [];
  for (let y = 1; y <= height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const id = toId({ x, y });
      const input = data[id];
      row.push(input === undefined ? '' : `"${input}"`);
    }      
    rows.push(row.join(','));
  }
  return rows.join('\n');  
}

export function authorizeDrive(callback) {
  window.gapi.load('client:auth2', () => {
    window.gapi.client.init({
      apiKey: DRIVE_API_KEY,
      clientId: DRIVE_CLIENT_ID,
      scope: DRIVE_SCOPES.join(' ')
    }).then(() => {
      // Listen for sign-in state changes.
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(signedIn => {
        if (signedIn) {
          return callback();
        }
      });
      const initialSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();      
      if (!initialSignedIn) {
        window.gapi.auth2.getAuthInstance().signIn();
      } else {
        return callback();
      }
    });
  });
}

export function uploadCSV(csv, callback) {
  const metadata = {
    title: `Spreadsheet | ${new Date().toString()}`,
    mimeType: 'application/vnd.google-apps.spreadsheet',
  };
  
  const contentType = 'text/csv';
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";          
  
  const base64Data = btoa(csv);
  const multipartRequestBody =
  delimiter +
  'Content-Type: application/json\r\n\r\n' +
  JSON.stringify(metadata) +
  delimiter +
  'Content-Type: ' + contentType + '\r\n' +
  'Content-Transfer-Encoding: base64\r\n' +
  '\r\n' +
  base64Data +
  close_delim;
  
  const request = window.gapi.client.request({
    'path': '/upload/drive/v2/files',
    'method': 'POST',
    'params': { 'uploadType': 'multipart' },
    'headers': {
      'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
    },
    'body': multipartRequestBody
  });
  
  request.execute(file => {
    callback();
    // Open doc in new tab
    const a = document.createElement('a');
    a.target = '_blank';
    a.href = file.alternateLink;
    a.click();
  });
}

