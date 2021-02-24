/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as vscode from 'vscode';
import { Payload } from './lwcBuilderEvent';

export const createLwcFolder = async (payload: Payload): void => {
  const { componentName, html, css, js, test, meta, svg } = payload;
  const wsedit = new vscode.WorkspaceEdit();
  const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder

  const jsFile = vscode.Uri.file(
    `${wsPath}/${payload.componentName}/${payload.componentName}.js`
  );
  const metaFile = vscode.Uri.file(
    `${wsPath}/${payload.componentName}/${payload.componentName}.js-meta.xml`
  );
  wsedit.createFile(jsFile, { ignoreIfExists: true });
  wsedit.createFile(metaFile, { ignoreIfExists: true });

  if (html) {
    const htmlFile = vscode.Uri.file(
      `${wsPath}/${payload.componentName}/${payload.componentName}.html`
    );
    wsedit.createFile(htmlFile, { ignoreIfExists: true });
  }
  if (css) {
    const cssFile = vscode.Uri.file(
      `${wsPath}/${payload.componentName}/${payload.componentName}.css`
    );
    wsedit.createFile(cssFile, { ignoreIfExists: true });
  }
  if (test) {
    const testFile = vscode.Uri.file(
      `${wsPath}/${payload.componentName}/__tests__/${payload.componentName}.test.js`
    );
    wsedit.createFile(testFile, { ignoreIfExists: true });
  }
  if (svg) {
    const svgFile = vscode.Uri.file(
      `${wsPath}/${payload.componentName}/${payload.componentName}.svg`
    );
    wsedit.createFile(svgFile, { ignoreIfExists: true });
  }

  // Create folder and files
  vscode.workspace.applyEdit(wsedit);

  const jsData = Buffer.from(js, 'utf8');
  await vscode.workspace.fs.writeFile(jsFile, jsData);

  const metaData = Buffer.from(meta, 'utf8');
  await vscode.workspace.fs.writeFile(metaFile, metaData);

  vscode.window.showInformationMessage(
    `Created a new lwc bundle : ${componentName}`
  );
};
