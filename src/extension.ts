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

export function deactivate() {}
