/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { HTML_FILE, LWC_BUILDER_UI_PATH } from './constants';
import { HtmlUtils } from './htmlUtils';

export function getWebviewContent(
  context: vscode.ExtensionContext,
  webview: vscode.Webview
) {
  const pathToLwcDist = path.join(context.extensionPath, LWC_BUILDER_UI_PATH);
  const pathToHtml = path.join(pathToLwcDist, HTML_FILE);
  let html = fs.readFileSync(pathToHtml).toString();
  html = HtmlUtils.transformHtml(html, pathToLwcDist, webview);
  return html;
}
