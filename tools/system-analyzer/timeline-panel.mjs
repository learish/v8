// Copyright 2020 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { defineCustomElement, V8CustomElement } from './helper.mjs';
import { SynchronizeSelectionEvent } from './events.mjs';
import './timeline/timeline-track.mjs';

defineCustomElement('timeline-panel', (templateText) =>
  class TimelinePanel extends V8CustomElement {
    constructor() {
      super(templateText);
      this.addEventListener(
        'scrolltrack', e => this.handleTrackScroll(e));
      this.addEventListener(
        SynchronizeSelectionEvent.name,
        e => this.handleSelectionSyncronization(e));
    }

    set nofChunks(count) {
      for (const track of this.timelineTracks) {
        track.nofChunks = count;
      }
    }

    get nofChunks() {
      return this.timelineTracks[0].nofChunks;
    }

    get timelineTracks() {
      return this.$("slot").assignedNodes().filter(
        node => node.nodeType === Node.ELEMENT_NODE);
    }

    handleTrackScroll(event) {
      //TODO(zcankara) add forEachTrack  helper method
      for (const track of this.timelineTracks) {
        track.scrollLeft = event.detail;
      }
    }

    handleSelectionSyncronization(event) {
      this.timeSelection = {start:event.start, end:event.end};
    }

    set timeSelection(timeSelection) {
      if (timeSelection.start > timeSelection.end) {
        throw new Error("Invalid time range");
      }
      for (const track of this.timelineTracks) {
        track.timeSelection = timeSelection;;
      }
    }
  });
