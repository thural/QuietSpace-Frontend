// src/RoutesConfig.tsx
import { Route, Routes } from "react-router-dom";
import { lazy } from "react";

const FeedContainer = lazy(() => import("./components/feed/FeedContainer"));
const FeedPage = lazy(() => import("./pages/feed/FeedPage"));
const PostContainer = lazy(() => import("./components/feed/PostContainer"));
const SearchPage = lazy(() => import("./pages/search/SearchPage"));
const ChatPage = lazy(() => import("./pages/chat/ChatPage"));
const ChatPanel = lazy(() => import("./components/chat/message/ChatPanel"));
const ChatPlaceholder = lazy(() => import("./components/chat/message/ChatPlaceholder"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const UserProfileContainer = lazy(() => import("./components/profile/UserProfileContainer"));
const ProfileContainer = lazy(() => import("./components/profile/ProfileContainer"));
const NotificationPage = lazy(() => import("./pages/notification/NotifiactionPage"));
const NotificationList = lazy(() => import("./components/notification/list/NotificationList"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const SignoutPage = lazy(() => import("./pages/auth/signout/SignoutPage"));
const ErrorComponent = lazy(() => import("./components/shared/errors/ErrorComponent"));

const RoutesConfig = () => (
    <Routes>
        <Route path="/" element={<FeedContainer />} />
        <Route path="/feed/*" element={<FeedPage />}>
            <Route index element={<FeedContainer />} />
            <Route path=":postId" element={<PostContainer />} />
        </Route>
        <Route path="/search/*" element={<SearchPage />} />
        <Route path="/chat/*" element={<ChatPage />}>
            <Route index element={<ChatPlaceholder />} />
            <Route path=":chatId" element={<ChatPanel />} />
        </Route>
        <Route path="/profile" element={<ProfilePage />}>
            <Route index element={<UserProfileContainer />} />
            <Route path=":userId" element={<ProfileContainer />} />
        </Route>
        <Route path="/notification/*" element={<NotificationPage />}>
            <Route path=":category" element={<NotificationList />} />
        </Route>
        <Route path="/settings/*" element={<SettingsPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/signout" element={<SignoutPage />} />
        <Route path="*" element={<ErrorComponent message="error 404 page not found" />} />
    </Routes>
);

export default RoutesConfig;