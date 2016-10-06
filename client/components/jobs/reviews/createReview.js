import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import Cookies from 'js-cookie';
import { createReview, isReviewed } from '../../../actions/review';
import StarReview from './starReview';

class createReviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
       review: '',
       numericalReview: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleStarRate = this.handleStarRate.bind(this);
  }
  componentWillMount() {
    const params = {
      type: this.props.reviews.info.type,
      review_id: Cookies.getJSON('user').userid,
      job_id: this.props.reviews.info.job_id,
    };
    this.props.isReviewed(params).then(() => {
      if (this.props.reviews.isReviewed) {
        browserHistory.push('/completedreview');
      }
    });
  }

  handleSubmit(event) {
      event.preventDefault();
      let params = {};
      if (this.props.reviews.info.type === 'employer') {
        params = {
          type: this.props.reviews.info.type,
          review_id: Cookies.getJSON('user').userid,
          job_id: this.props.reviews.info.job_id,
          employerReview: this.state.review,
          numericalEmployerReview: this.state.numericalReview
        };
        this.props.createReview(params);
        browserHistory.push('/profile');
        this.setState({employerReview: ''});
      }
      else {
        params = {
          type: this.props.reviews.info.type,
          review_id: Cookies.getJSON('user').userid,
          job_id: this.props.reviews.info.job_id,
          employeeReview: this.state.review,
          numericalEmployeeReview: this.state.numericalReview
        };
        this.props.createReview(params);
        browserHistory.push('/profile');
        this.setState({employerReview: ''});
      }
  }
  handleChange(event) {
      event.preventDefault();
      this.setState({ review: event.target.value });
  }
   handleStarRate(val) {
     this.setState({ numericalReview: val.toString() });
   }

  render() {
    return (
      <div>
        <center>
          <form onSubmit={this.handleSubmit}>
            <h4> Write a review! </h4>
            <p> Its always great to hear from you!</p>
            <StarReview star={this.handleStarRate} setStar={parseInt(this.state.numericalReview)} />
            <textarea
              type="text"
              placeholder="Write a review..."
              value={this.state.review}
              className='reviewInput'
              onChange={this.handleChange}
            ></textarea>
            <div>
              <button>Submit</button>
            </div>
          </form>
        </center>
      </div>
    );
  }
}

function mapStateToProps({ reviews }) {
  return { reviews };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createReview, isReviewed }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(createReviews);
