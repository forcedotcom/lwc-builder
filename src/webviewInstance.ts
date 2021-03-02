/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { HTML_FILE, LWC_BUILDER_UI_PATH } from './constants';
import { HtmlUtils } from './htmlUtils';
import { LWCBuilderEvent } from './lwcBuilderEvent';
import { createLwcFolder } from './lwcBuilderHandler';

export class WebviewInstance {
  public subscriptions: vscode.Disposable[] = [];
  private webviewPanel: vscode.WebviewPanel;
  private lwcFolderUri: vscode.Uri;

  constructor(context: vscode.ExtensionContext, uri: vscode.Uri) {
    // Create webview panel
    this.webviewPanel = vscode.window.createWebviewPanel(
      'lwcBuilder',
      'LWC Builder',
      vscode.ViewColumn.One,
      {
        // Enable scripts in the webview
        enableScripts: true,
      }
    );

    // Set webview panel content
    this.webviewPanel.webview.html = this.getWebviewContent(
      context,
      this.webviewPanel.webview
    );

    // Define handler for received messages
    this.webviewPanel.webview.onDidReceiveMessage(
      this.onDidReceiveMessageHandler,
      this,
      this.subscriptions
    );

    // Make sure we get rid of the event listeners when our editor is closed
    this.webviewPanel.onDidDispose(this.dispose, this, this.subscriptions);

    this.lwcFolderUri = uri;
  }

  private getWebviewContent(
    context: vscode.ExtensionContext,
    webview: vscode.Webview
  ) {
    const pathToLwcDist = path.join(context.extensionPath, LWC_BUILDER_UI_PATH);
    const pathToHtml = path.join(pathToLwcDist, HTML_FILE);
    let html = fs.readFileSync(pathToHtml).toString();
    html = HtmlUtils.transformHtml(html, pathToLwcDist, webview);
    return html;
  }

  protected onDidReceiveMessageHandler(event: LWCBuilderEvent): void {
    // Handle messages from the webview
    switch (event.type) {
      case 'create_button_clicked':
        createLwcFolder(event.payload, this.lwcFolderUri);
      case 'error':
        vscode.window.showErrorMessage(event.error);
        return;
      default:
        vscode.window.showInformationMessage(`Unknown event: ${event.type}`);
    }
  }

  protected dispose(): void {
    this.subscriptions.forEach((disposable) => disposable.dispose());
  }
}
