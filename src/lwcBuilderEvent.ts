/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// TODO: Can we share this class with lwc-builder-ui?
export interface LWCBuilderEvent {
  type: string;
  payload: Payload;
  error: string;
}

export class Payload {
  public componentName: string;
  public css: string;
  public html: string;
  public js: string;
  public meta: string;
  public svg: string;
  public test: string;

  constructor(
    componentName: string,
    css: string,
    html: string,
    js: string,
    meta: string,
    svg: string,
    test: string
  ) {
    this.componentName = componentName;
    this.css = css;
    this.html = html;
    this.js = js;
    this.meta = meta;
    this.svg = svg;
    this.test = test;
  }
}
