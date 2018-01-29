/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule editOnFocus
 * @flow
 */

'use strict';

var EditorState = require('EditorState');
var UserAgent = require('UserAgent');

function editOnFocus(e: SyntheticFocusEvent): void {
  var editorState = this.props.editorState;
  var currentSelection = editorState.getSelection();
  if (currentSelection.getHasFocus()) {
    return;
  }

  var selection = currentSelection.set('hasFocus', true);
  this.props.onFocus && this.props.onFocus(e);

  // When the tab containing this text editor is hidden and the user does a
  // find-in-page in a _different_ tab, Chrome on Mac likes to forget what the
  // selection was right after sending this focus event and (if you let it)
  // moves the cursor back to the beginning of the editor, so we force the
  // selection here instead of simply accepting it in order to preserve the
  // old cursor position. See https://crbug.com/540004.
  // [DAGU] Modified to solve IE bug when move to editor
  // https://github.com/facebook/draft-js/issues/1055
  // Fixed in latest draft version.
  if (UserAgent.isBrowser('Chrome < 60.0.3081.0')) {
    this.update(EditorState.forceSelection(editorState, selection));
  } else {
    this.update(EditorState.acceptSelection(editorState, selection));
  }
}

module.exports = editOnFocus;
