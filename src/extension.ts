/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import { getWebviewContent } from './lwcBuilder';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "lwc-builder" is now active!');

	let disposable = vscode.commands.registerCommand('lwc-builder.openLWCBuilder', () => {
		vscode.window.showInformationMessage('Hello World from lwc-builder!');
		const webviewPanel = vscode.window.createWebviewPanel(
			'lwcBuilder',
			'LWC Builder',
			vscode.ViewColumn.One,
			{
				// Enable scripts in the webview
				enableScripts: true
			}
		);

		webviewPanel.webview.html = getWebviewContent(context, webviewPanel.webview);
	});

  context.subscriptions.push(disposable);
}

// export function deactivate() {}
