import React from 'react';
import { connect } from 'react-redux';
import WalletsBasiliskRefreshRender from './walletsBasiliskRefresh.render';

class WalletsBasiliskRefresh extends React.Component {
  isBasiliskRefresh() {
   return this.props &&
    this.props.Dashboard.basiliskRefresh;
  }

  render() {
    if (this.isBasiliskRefresh()) {
      return WalletsBasiliskRefreshRender.call(this);
    }

    return null;
  }
}
const mapStateToProps = (state) => {
  return {
    Dashboard: {
      basiliskRefresh: state.Dashboard.basiliskRefresh,
    }
  };
};
export default connect(mapStateToProps)(WalletsBasiliskRefresh);
