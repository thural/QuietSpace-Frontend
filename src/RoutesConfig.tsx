import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "@/shared/auth/ProtectedRoute";
import { PERMISSIONS } from "@/shared/auth/permissions";

const FeedContainer = lazy(() => import("./features/feed/presentation/components/FeedContainer"));
const FeedPage = lazy(() => import("./pages/feed/FeedPage"));
const PostContainer = lazy(() => import("./features/feed/presentation/components/PostContainer"));
const SearchPage = lazy(() => import("./pages/search/SearchPage"));
const ChatPage = lazy(() => import("./pages/chat/ChatPage"));
const ChatPanel = lazy(() => import("./features/chat/presentation/components/messages/ChatPanel"));
const ChatPlaceholder = lazy(() => import("./features/chat/presentation/components/messages/ChatPlaceholder"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const UserProfileContainer = lazy(() => import("./features/profile/UserProfileContainer"));
const ProfileContainer = lazy(() => import("./features/profile/ProfileContainer"));
const NotificationPage = lazy(() => import("./pages/notification/NotifiactionPage"));
const NotificationList = lazy(() => import("./features/notification/presentation/components/NotificationList"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const ErrorComponent = lazy(() => import("./shared/errors/ErrorComponent"));

const RoutesConfig = () => (
    <Routes>
        {/* Protected routes */}
        <Route path="/" element={
            <ProtectedRoute>
                <FeedPage />
            </ProtectedRoute>
        } />

        <Route path="/feed/*" element={
            <ProtectedRoute>
                <FeedPage />
            </ProtectedRoute>
        }>
            <Route index element={<FeedContainer />} />
            <Route path=":postId" element={<PostContainer />} />
        </Route>

        <Route path="/dashboard/*" element={
            <ProtectedRoute>
                <div>Dashboard Content</div>
            </ProtectedRoute>
        } />

        <Route path="/search/*" element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.SEARCH_CONTENT]}>
                <SearchPage />
            </ProtectedRoute>
        } />

        <Route path="/chat/*" element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.READ_MESSAGES]}>
                <ChatPage />
            </ProtectedRoute>
        }>
            <Route index element={<ChatPlaceholder />} />
            <Route path=":chatId" element={<ChatPanel />} />
        </Route>

        <Route path="/profile/*" element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.VIEW_PROFILES]}>
                <ProfilePage />
            </ProtectedRoute>
        }>
            <Route index element={<UserProfileContainer />} />
            <Route path=":userId" element={<ProfileContainer />} />
        </Route>

        <Route path="/notification/*" element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.READ_NOTIFICATIONS]}>
                <NotificationPage />
            </ProtectedRoute>
        }>
            <Route path=":category" element={<NotificationList />} />
        </Route>

        <Route path="/settings/*" element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.EDIT_PROFILE]}>
                <SettingsPage />
            </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/*" element={
            <ProtectedRoute requiredPermissions={[PERMISSIONS.SYSTEM_ADMIN]}>
                <div>Admin Dashboard</div>
            </ProtectedRoute>
        } />

        {/* 404 catch-all */}
        <Route path="*" element={<ErrorComponent message="error 404 page not found" />} />
    </Routes>
);

export default RoutesConfig;