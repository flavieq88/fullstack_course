const SignupForm = ({ username, password, name, handleUsernameChange, handlePasswordChange, handleNameChange, handleSubmit }) => {
  return (
    <div className='signupForm'>
      <h4>Don't own an account? Sign up for free!</h4>
      <form onSubmit={handleSubmit}>
        <div>
          Username:
          <input
            type='text'
            value={username}
            name='Username'
            onChange={handleUsernameChange}
            data-testid='newusername'
          />
        </div>
        <div>
          Name:
          <input
            type='text'
            value={name}
            name='Name'
            onChange={handleNameChange}
            data-testid='newname'
          />
        </div>
        <div>
          Password:
          <input
            type='password'
            value={password}
            name='Password'
            onChange={handlePasswordChange}
            data-testid='newpassword'
          />
        </div>
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};

export default SignupForm;