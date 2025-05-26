"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate, Link } from "react-router-dom";
import BlogList from "../../../components/Blog/BlogList";
import NavBar from "../../../components/Header/NavBar";
import SideBar from "../../../components/Sidebar/SideBar";
import FollowButton from "../../../components/Button/FollowButton";
import {
  Users,
  UserPlus,
  Calendar,
  MapPin,
  LinkIcon,
  ExternalLink,
  X,
  ChevronLeft,
  BookOpen,
  Grid,
  Heart,
  MessageSquare,
  Settings,
} from "lucide-react";

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `/api/users/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setIsFollowing(data.amIFollowing);
        } else {
          console.error("Error fetching user information");
        }
      } catch (error) {
        console.error("API connection error:", error);
      }
    };

    const fetchMyPosts = async () => {
      try {
        const response = await fetch(
          `/api/posts/${userId}-posts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const postsWithId = data.map((post) => ({
            ...post,
            _id: post._id || post.id,
          }));
          setMyPosts(postsWithId);
        } else {
          console.error("Error fetching posts:", await response.json());
        }
      } catch (error) {
        console.error("API connection error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    fetchMyPosts();
  }, [userId]);

  const fetchFollowers = async () => {
    const token = localStorage.getItem("token");
    setModalLoading(true);
    try {
      const response = await fetch(
        `/api/follows/${userId}/followers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Followers data:", data);
        setFollowers(data);
      } else {
        console.error("Error fetching followers:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const fetchFollowing = async () => {
    const token = localStorage.getItem("token");
    setModalLoading(true);
    try {
      const response = await fetch(
        `/api/follows/${userId}/following`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Following data:", data);
        setFollowing(data);
      } else {
        console.error("Error fetching following:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching following:", error);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <NavBar />
      </header>

      <div className="flex pt-16">
        <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-900 w-60 z-40 shadow-lg">
          <SideBar />
        </aside>

        <div className="ml-60 flex-grow p-6">
          <div className="relative mb-8">
            <div className="h-72 rounded-xl overflow-hidden shadow-lg">
              <div className="w-full h-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500"></div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-white/30 transition-all shadow-md"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="bg-white rounded-xl shadow-lg p-8 mx-4 -mt-24 relative z-10 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 -mt-20 md:-mt-28 mx-auto md:mx-0">
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture || "/placeholder.svg"}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-20 w-20 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-grow text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        {user?.name || "User"}
                      </h1>
                      <p className="text-gray-500 text-lg mb-3">
                        @
                        {user?.username ||
                          user?.name?.toLowerCase().replace(/\s/g, "") ||
                          "username"}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                        {user?.location && (
                          <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                            <MapPin className="h-4 w-4 mr-1.5 text-purple-500" />
                            <span>{user.location}</span>
                          </div>
                        )}
                        <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                          <Calendar className="h-4 w-4 mr-1.5 text-purple-500" />
                          <span>
                            Joined{" "}
                            {new Date().toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {user?.website && (
                          <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                            <LinkIcon className="h-4 w-4 mr-1.5 text-purple-500" />
                            <a
                              href={user.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:underline"
                            >
                              {user.website.replace(/^https?:\/\//, "")}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <div className="flex space-x-2">
                        <FollowButton
                          userId={userId}
                          isFollowing={isFollowing}
                          setIsFollowing={setIsFollowing}
                          onFollowChange={(change) => {
                            setUser((prevUser) => ({
                              ...prevUser,
                              followerNumber: prevUser.followerNumber + change,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 md:hidden">
                    <div className="flex justify-center space-x-2">
                      <FollowButton
                        userId={userId}
                        isFollowing={isFollowing}
                        setIsFollowing={setIsFollowing}
                        onFollowChange={(change) => {
                          setUser((prevUser) => ({
                            ...prevUser,
                            followerNumber: prevUser.followerNumber + change,
                          }));
                        }}
                      />
                      <button className="p-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                        <Settings className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center md:justify-start space-x-12">
                    <button
                      className="flex bg-white border-white flex-col items-center md:items-start group"
                      onClick={() => {
                        setIsFollowersModalOpen(true);
                        fetchFollowers();
                      }}
                    >
                      <span className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {user?.followerNumber || 0}
                      </span>
                      <span className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors flex items-center">
                        <Users className="h-4 w-4 mr-1.5 hidden md:inline" />
                        Followers
                      </span>
                    </button>

                    <button
                      className="flex flex-col items-center md:items-start group bg-white border-white"
                      onClick={() => {
                        setIsFollowingModalOpen(true);
                        fetchFollowing();
                      }}
                    >
                      <span className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {user?.followingNumber || 0}
                      </span>
                      <span className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors flex items-center">
                        <UserPlus className="h-4 w-4 mr-1.5 hidden md:inline" />
                        Following
                      </span>
                    </button>

                    <div className="flex flex-col items-center md:items-start group">
                      <span className="text-3xl font-bold text-gray-900">
                        {myPosts.length || 0}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <BookOpen className="h-4 w-4 mr-1.5 hidden md:inline" />
                        Posts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 overflow-hidden">
            <button
              className={`flex-1 bg-white py-5 px-5 mr-2  text-center font-medium transition-all ${
                activeTab === "posts"
                  ? "text-purple-600  border-purple-600 bg-purple-50/50"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/30"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              <div className="flex items-center justify-center">
                <Grid className="h-5 w-5 mr-2" />
                Posts
              </div>
            </button>
            <button
              className={`flex-1 bg-white py-5 px-4 text-center font-medium transition-all ${
                activeTab === "activity"
                  ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/50"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/30"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              <div className="flex items-center justify-center">
                <Heart className="h-5 w-5 mr-2" />
                Activity
              </div>
            </button>
          </div>

          {activeTab === "posts" ? (
            <>
              {loading ? (
                <div className="flex justify-center items-center my-16">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200"></div>
                    <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-purple-600 border-t-transparent"></div>
                  </div>
                  <p className="ml-4 text-gray-600 text-lg font-medium">
                    Loading posts...
                  </p>
                </div>
              ) : myPosts.length > 0 ? (
                <BlogList blogs={myPosts} setBlogs={setMyPosts} />
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <div className="w-24 h-24 mx-auto bg-purple-50 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="h-12 w-12 text-purple-300" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {user?.name || "This user"} hasnt published any posts yet.
                    Check back later for new content.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Explore other posts
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Recent Activity
              </h3>

              <div className="space-y-6">
                {myPosts.length > 0 ? (
                  myPosts.slice(0, 5).map((post, index) => (
                    <div key={post.id || index} className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        {index < myPosts.slice(0, 5).length - 1 && (
                          <div className="h-full w-0.5 bg-purple-100 mx-auto mt-2"></div>
                        )}
                      </div>
                      <div className="flex-grow pb-6">
                        <div className="flex items-center mb-1">
                          <h4 className="text-lg font-medium text-gray-900">
                            Published a new post
                          </h4>
                          <span className="ml-auto text-sm text-gray-500">
                            {new Date(
                              post.createdAt || Date.now()
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <Link
                          to={`/blog/${post._id}`}
                          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                        >
                          <p className="font-medium text-purple-600">
                            {post.title}
                          </p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <span className="flex items-center mr-4">
                              <Heart className="h-4 w-4 mr-1 text-pink-500" />
                              {post.likeCount || 0} likes
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1 text-blue-500" />
                              {post.commentCount || 0} comments
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto bg-purple-50 rounded-full flex items-center justify-center mb-4">
                      <Heart className="h-10 w-10 text-purple-300" />
                    </div>
                    <h4 className="text-xl font-medium text-gray-800 mb-2">
                      No activity yet
                    </h4>
                    <p className="text-gray-600">
                      When {user?.name || "this user"} interacts with posts or
                      publishes content, it will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isFollowersModalOpen && (
        <FollowersModal
          title="Followers"
          onClose={() => setIsFollowersModalOpen(false)}
          items={followers}
          loading={modalLoading}
        />
      )}

      {isFollowingModalOpen && (
        <FollowersModal
          title="Following"
          onClose={() => setIsFollowingModalOpen(false)}
          items={following}
          loading={modalLoading}
        />
      )}
    </div>
  );
};

const FollowersModal = ({ title, onClose, items, loading }) => {
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false);

  const handleProfileClick = async (authorId) => {
    setNavigating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate(`/profile/${authorId}`);
    } catch (error) {
      console.error("Error while navigating:", error);
    } finally {
      setNavigating(false);
      onClose();
    }
  };

  if (navigating) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-80 text-center shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl overflow-hidden w-96 max-h-[80vh] flex flex-col shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              {title === "Followers" ? (
                <Users className="h-5 w-5 mr-2" />
              ) : (
                <UserPlus className="h-5 w-5 mr-2" />
              )}
              {title}
            </h2>
            <button
              className="text-white bg-gradient-to-r from-pink-600 to-pink-500 hover:text-white/80 transition-colors p-1 rounded-full border-white"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-grow p-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              <p className="ml-3 text-gray-500">Loading...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                {title === "Followers" ? (
                  <Users className="h-10 w-10 text-purple-300" />
                ) : (
                  <UserPlus className="h-10 w-10 text-purple-300" />
                )}
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No {title.toLowerCase()} yet
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                When people{" "}
                {title === "Followers" ? "follow" : "are followed by"} this
                user, they will appear here.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="p-3 flex items-center hover:bg-purple-50 rounded-lg cursor-pointer transition-colors border border-gray-100 hover:border-purple-200"
                  onClick={() => handleProfileClick(item.id)}
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                    {item.profilePicture ? (
                      <img
                        src={item.profilePicture || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      @
                      {item.username ||
                        item.name?.toLowerCase().replace(/\s/g, "")}
                    </p>
                  </div>
                  <div className="ml-2 p-2 rounded-full hover:bg-purple-100 transition-colors">
                    <ExternalLink className="h-4 w-4 text-purple-600" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

FollowersModal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string,
      profilePicture: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ProfilePage;
