const LoginForm = ({ username, password, handleUsernameChange, handlePasswordChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className='loginForm'>
      <div>
        Username:
        <input
          type='text'
          value={username}
          name='Username'
          onChange={handleUsernameChange}
          data-testid='username'
        />
      </div>
      <div>
        Password:
        <input
          type='password'
          value={password}
          name='Password'
          onChange={handlePasswordChange}
          data-testid='password'
        />
      </div>
      <button type="submit">Log in</button>
    </form>
  );
};

export default LoginForm;