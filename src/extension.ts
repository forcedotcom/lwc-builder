/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import { WebviewInstance } from './webviewInstance';

export function activate(context: vscode.ExtensionContext): void {
  console.log('Congratulations, your extension "lwc-builder" is now active!');

  const openLWCBuilderCommand = vscode.commands.registerCommand(
    'lwc-builder.openLWCBuilder',
    (uri: vscode.Uri) => {
      new WebviewInstance(context, uri);
    }
  );

  context.subscriptions.push(openLWCBuilderCommand);
}

// export function deactivate() {}
