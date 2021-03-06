import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

interface FormErrors {
  errorEncryptionPassword?: string;
}

class EncryptionLoginForm extends React.PureComponent {
  state: {
    errors: FormErrors,
    encryptionPassword: string;
  };

  props: {
    onSubmit: (encryptionPassword: string) => void;
    loading?: boolean;
    error?: Error;
  };

  constructor(props: any) {
    super(props);
    this.state = {
      errors: {},
      encryptionPassword: '',
    };
    this.generateEncryption = this.generateEncryption.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event: React.ChangeEvent<any>) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  generateEncryption(e: any) {
    e.preventDefault();

    const encryptionPassword = this.state.encryptionPassword;

    let errors: FormErrors = {};
    const fieldRequired = 'This field is required!';
    if (!encryptionPassword) {
      errors.errorEncryptionPassword = fieldRequired;
    }

    if (Object.keys(errors).length) {
      this.setState({errors: errors});
      return;
    } else {
      this.setState({errors: {}});
    }

    this.props.onSubmit(encryptionPassword);
  }

  render() {
    const styles = {
      form: {
      },
      submit: {
        marginTop: 40,
        textAlign: 'right',
      },
    };

    return (
      <React.Fragment>
        {(this.props.error) && (<div>Error! {this.props.error.message}</div>)}
        <form style={styles.form} onSubmit={this.generateEncryption}>
          <TextField
            type="password"
            errorText={this.state.errors.errorEncryptionPassword}
            floatingLabelText="Encryption Password"
            name="encryptionPassword"
            value={this.state.encryptionPassword}
            onChange={this.handleInputChange}
          />

          <div style={styles.submit}>
            <RaisedButton
              type="submit"
              label={this.props.loading ? 'Loading…' : 'Log In'}
              secondary={true}
              disabled={this.props.loading}
            />
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default EncryptionLoginForm;
