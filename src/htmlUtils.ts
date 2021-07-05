/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as path from 'path';
import * as vscode from 'vscode';

/**
 * The index.html file in the dist folder of the @salesforce/lwc-builder-ui
 * is built by webpack to be displayed in a normal web context.  however, vscode
 * uses a custom protocol ( vscode-webview-resource instead of http ) to load resources
 * so the html needs to be manipulated dynamcially to run inside of vscode.
 */
export class HtmlUtils {
  /**
   * This regex will match tags in a string like this
   * <script type="module" src="index.js"></script>
   * And store just the filename section of the script tag as group[1]
   */
  protected static readonly scriptRegex =
    /script\stype=\"module\"\ssrc=\"(index\.js)\"/g;

  /**
   * This regex will match tags in a string like this
   * href="./resources/[any path]"
   * And store just the filename section of the script tag as group[1]
   */
  protected static readonly resourceRegex =
    /\shref=\"\.\/(resources\/[^\"]*)\"/g;

  /**
   *
   * @param html
   * @param pathToLwcDist
   * @param webview
   */
  public static transformHtml(
    html: string,
    pathToLwcDist: string,
    webview: vscode.Webview
  ): string {
    html = HtmlUtils.transformScriptTags(html, pathToLwcDist, webview);
    html = HtmlUtils.transformResourceFolders(html, pathToLwcDist, webview);
    html = HtmlUtils.replaceCspMetaTag(html, webview);
    return html;
  }

  /**
   * This section replaces the relative file paths that are produced by
   * webpack in the build in the dist folder with the protocol that
   * vscode uses internally.
   *
   * Initial html script tags look like this
   * <script src="./0.app.js"></script><script src="./app.js"></script>
   *
   * Each matched script tag gets transformed into into a vscode specific url
   * <script src="vscode-webview-resource:0.app.js"><script src="vscode-webview-resource:app.js">
   *
   * Since we don't know how many bundles webpack will produce in the dist directory, we regex match and
   * replace them in a while loop.
   *
   * @param html
   * @param pathToLwcDist
   * @param webview
   */
  public static transformScriptTags(
    html: string,
    pathToLwcDist: string,
    webview: vscode.Webview
  ): string {
    let matches;
    let newScriptSrc;
    // tslint:disable-next-line:no-conditional-assignment
    while ((matches = HtmlUtils.scriptRegex.exec(html)) !== null) {
      newScriptSrc = webview.asWebviewUri(
        vscode.Uri.file(path.join(pathToLwcDist, matches[1]))
      );
      html = html.replace(`${matches[1]}`, newScriptSrc.toString());
    }
    return html;
  }

  /**
   * This section replaces the relative file paths that are produced by
   * webpack in the build in the dist folder with the protocol that
   * vscode uses internally.
   *
   * Initial html link tags look like this
   * <link rel="stylesheet" type="text/css" href="./resources/slds/styles/salesforce-lightning-design-system.min.css" />
   *
   * Each matched script tag gets transformed into into a vscode specific url
   * <link rel="stylesheet" type="text/css" href="vscode-webview-resource://resources/slds/styles/salesforce-lightning-design-system.min.css" />
   *
   * Since we don't know how many bundles webpack will produce in the dist directory, we regex match and
   * replace them in a while loop.
   *
   * @param html
   * @param pathToLwcDist
   * @param webview
   */
  public static transformResourceFolders(
    html: string,
    pathToLwcDist: string,
    webview: vscode.Webview
  ): string {
    let matches;
    let newResourceSrc;
    // tslint:disable-next-line:no-conditional-assignment
    while ((matches = HtmlUtils.resourceRegex.exec(html)) !== null) {
      newResourceSrc = webview.asWebviewUri(
        vscode.Uri.file(path.join(pathToLwcDist, matches[1]))
      );
      html = html.replace(`./${matches[1]}`, newResourceSrc.toString());
    }
    return html;
  }

  /**
   * This method adds stricter CSP for displaying this webview inside of VSCode
   * @param html
   * @param webview
   */
  public static replaceCspMetaTag(
    html: string,
    webview: vscode.Webview
  ): string {
    const cspMetaTag = `<meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self' ${webview.cspSource};
      connect-src ${webview.cspSource};
      script-src-elem ${webview.cspSource} vscode-webview:;
      img-src ${webview.cspSource} vscode-webview:;
      script-src ${webview.cspSource} vscode-webview:;
      style-src 'unsafe-inline' ${webview.cspSource} vscode-webview:;"
    />`;

    html = html.replace('</head>', `${cspMetaTag}</head>`);
    return html;
  }
}
