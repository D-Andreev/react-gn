import './posts.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { postsActions } from './actions/postsActions';
import './posts.css';

class posts extends Component {
    onClick = () => {
        this.props.postsActions();
    };

    render() {
        const { posts, isLoadingPosts } = this.props;
        return (
            <div className="posts">
                <div>
                    <button onClick={this.onClick}> Get posts </button>
                </div>
                {isLoadingPosts ? (
                    <h2>Loading...</h2>
                ) : (
                    <div>
                        {posts.map((x) =>
                            <div className="post" key={x.id}>
                                <div>{x.id}</div>
                                <div>{x.title}</div>
                                <div>{x.body}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    postsActions: () => dispatch(postsActions())
});

const mapStateToProps = state => ({
    posts: state.myPostsReducer.posts,
    isLoadingPosts: state.myPostsReducer.isLoadingPosts
});

export default connect(mapStateToProps, mapDispatchToProps)(posts);
