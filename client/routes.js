import React from 'react';
import Cookies from 'js-cookie';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerActions, routerMiddleware } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';

import SignIn from './components/account/signIn';
import rootReducer from './reducers/mainReducer';
import App from './app.js';
import CreateJob from './components/jobs/createJob';
import UserProfile from './components/account/userProfile';
import SignUp from './components/account/signUp';
import JobListings from './components/jobs/jobListings';
import JobMap from './components/map/jobMap';
import SelectedJob from './components/jobs/selectedJob';
import JobAdmin from './components/jobs/jobAdmin.js';
import Profile from './components/account/profile';
import Chat from './components/account/chat';
import CreateReview from './components/jobs/reviews/createReview';
import CompleteReview from './components/jobs/reviews/completedReview';
import Payment from './components/account/payment.js';

//Basic routing, to add another route just do:
//<Route path='/insertUrl' component={insertComponentName} />
const styles = require('./styles/main.scss');
const routingMiddleware = routerMiddleware(browserHistory);
const createStoreWithMiddleWare = applyMiddleware(thunk, routingMiddleware)(createStore);
const store = createStoreWithMiddleWare(rootReducer, window.devToolsExtension ? window.devToolsExtension() : f => f, autoRehydrate());
// const history = syncHistoryWithStore(browserHistory, store);
persistStore(store);

const UserIsAuthenticated = UserAuthWrapper({
  authSelector: () => Cookies.getJSON('user'), // how to get the user state
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'UserIsAuthenticated' // a nice name for this auth check
});

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <Route path='signup' component={SignUp} />
        <Route path='login' component={SignIn} />
        <Route path='createjob' component={UserIsAuthenticated(CreateJob)} />
        <Route path='userprofile' component={UserIsAuthenticated(UserProfile)} />
        <Route path='profile' component={UserIsAuthenticated(Profile)} />
        <Route path='payment' component={UserIsAuthenticated(Payment)} />
        <Route path='joblistings' component={JobListings} />
        <Route path='map' component={JobMap} />
        <Route path='selectedjob' component={SelectedJob} />
        <Route path='jobadmin' component={JobAdmin} />
        <Route path='chat' component={Chat} />
        <Route path='createreview' component={CreateReview} />
        <Route path='completedreview' component={CompleteReview} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));
