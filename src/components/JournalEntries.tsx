import * as Immutable from 'immutable';

import * as React from 'react';
import { List, ListItem } from '../widgets/List';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconDelete from 'material-ui/svg-icons/action/delete';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';

import * as ICAL from 'ical.js';

import { EventType, ContactType } from '../pim-types';

import * as EteSync from '../api/EteSync';

class JournalEntries extends React.PureComponent {
  static defaultProps = {
    prevUid: null,
  };

  state: {
    dialog?: string;
  };

  props: {
    journal: EteSync.Journal,
    entries: Immutable.List<EteSync.SyncEntry>,
    uid?: string,
  };

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.journal === undefined) {
      return (<div>Loading</div>);
    }

    const entries = this.props.entries.map((syncEntry, idx) => {
      const comp = new ICAL.Component(ICAL.parse(syncEntry.content));

      let icon;
      if (syncEntry.action === EteSync.SyncEntryAction.Add) {
        icon = (<IconAdd color="#16B14B" />);
      } else if (syncEntry.action === EteSync.SyncEntryAction.Change) {
        icon = (<IconEdit color="#FEB115" />);
      } else if (syncEntry.action === EteSync.SyncEntryAction.Delete) {
        icon = (<IconDelete color="#F20C0C" />);
      }

      let name;
      let uid;
      if (comp.name === 'vcalendar') {
        const vevent = EventType.fromVCalendar(comp);
        name = vevent.summary;
        uid = vevent.uid;
      } else if (comp.name === 'vcard') {
        const vcard = new ContactType(comp);
        name = vcard.fn;
        uid = vcard.uid;
      } else {
        name = 'Error processing entry';
        uid = '';
      }

      if (this.props.uid && (this.props.uid !== uid)) {
        return undefined;
      }

      return (
        <ListItem
          key={idx}
          leftIcon={icon}
          primaryText={name}
          secondaryText={uid}
          onClick={() => {
            this.setState({
              dialog: syncEntry.content
            });
          }}
        />
        );
    }).reverse();

    const actions = [(
      <FlatButton
        label="Close"
        primary={true}
        onClick={() => {
          this.setState({dialog: undefined});
        }}
      />
      ),
    ];
    return (
      <div>
        <Dialog
          title="Raw Content"
          actions={actions}
          modal={false}
          autoScrollBodyContent={true}
          open={this.state.dialog !== undefined}
          onRequestClose={() => {
            this.setState({dialog: undefined});
          }}
        >
          <pre>{this.state.dialog}</pre>
        </Dialog>
        <List>
          {entries}
        </List>
      </div>
    );
  }
}

export default JournalEntries;
