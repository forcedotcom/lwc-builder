/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as vscode from 'vscode';
import { Payload } from './lwcBuilderEvent';

const getLwcFolderPath = (uri: vscode.Uri) => {
  if (uri) {
    return uri.fsPath;
  } else {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
      return null;
    }
    return folders[0].uri.fsPath + '/force-app/main/default/lwc';
  }
};

export const createLwcFolder = async (
  payload: Payload,
  uri: vscode.Uri
): Promise<void> => {
  const { componentName, html, css, js, test, meta, svg } = payload;
  const wsedit = new vscode.WorkspaceEdit();
  const wsPath = getLwcFolderPath(uri);
  if (!wsPath) {
    return;
  }

  const filesData: { file: vscode.Uri; data: Buffer }[] = [];
  const fileOptions = { ignoreIfExists: false };
  const charset = 'utf8';

  const data = [
    {
      content: js,
      path: `${wsPath}/${componentName}/${componentName}.js`,
    },
    {
      content: meta,
      path: `${wsPath}/${componentName}/${componentName}.js-meta.xml`,
    },
    {
      content: html,
      path: `${wsPath}/${componentName}/${componentName}.html`,
    },
    {
      content: css,
      path: `${wsPath}/${componentName}/${componentName}.css`,
    },
    {
      content: test,
      path: `${wsPath}/${componentName}/__tests__/${componentName}.test.js`,
    },
    {
      content: svg,
      path: `${wsPath}/${componentName}/${componentName}.svg`,
    },
  ];

  data.forEach(({ content, path }) => {
    if (content) {
      const file = vscode.Uri.file(path);
      wsedit.createFile(file, fileOptions);
      filesData.push({ file: file, data: Buffer.from(content, charset) });
    }
  });

  // js and meta file must exist
  if (filesData.length < 1) {
    return;
  }

  // Create folder and files
  const folderCreated = await vscode.workspace.applyEdit(wsedit);

  // If the component already exists, cancel
  if (!folderCreated) {
    vscode.window.showErrorMessage(
      `Failed to create a folder. "${componentName}" component already exists.`
    );
    return;
  }

  // write contents to files
  filesData.forEach(async (f) => {
    await vscode.workspace.fs.writeFile(f.file, f.data);
  });

  // Open js file
  await vscode.window.showTextDocument(filesData[0].file);

  vscode.window.showInformationMessage(
    `New LWC bundle created : ${componentName}`
  );
};
