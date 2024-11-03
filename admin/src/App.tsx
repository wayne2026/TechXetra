import { ToastContainer } from "react-toastify";
import Loader from "./components/custom/loader";
import { useUser } from "./context/user_context";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/custom/error-boundary";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/custom/protected-route";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import EventsPage from "./pages/events/events";
import NotFound from "./pages/not-found";
import PageTitle from "./components/custom/page-title";
import Navbar from "./components/custom/navbar";
import UsersPage from "./pages/users";
import CreateEvent from "./pages/events/create";
import EnrolledEvent from "./pages/events/EnrolledEvent";
import UserDetails from "./pages/UserDetails";
import Update from "./pages/events/update";

const App = () => {
    const userContext = useUser();
    return userContext?.loading ? (
        <Loader />
    ) : (
        <div className="flex justify-center items-center">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <ErrorBoundary>
                <Navbar />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <PageTitle title="Home | TechXetra Admin" />
                                <HomePage />
                            </>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <>
                                <PageTitle title="Login | TechXetra Admin" />
                                <LoginPage />
                            </>
                        }
                    />

                    <Route
                        element={<ProtectedRoute isAuthenticated={userContext?.user ? true : false} redirect="/login" />}
                    >
                        <Route
                            path="/users"
                            element={
                                <>
                                    <PageTitle title="Users | TechXetra Admin" />
                                    <UsersPage />
                                </>
                            }
                        />
                        <Route
                            path="/events"
                            element={
                                <>
                                    <PageTitle title="Events | TechXetra Admin" />
                                    <EventsPage />
                                </>
                            }
                        />
                        <Route
                            path="/events/create"
                            element={
                                <>
                                    <PageTitle title="New Event | TechXetra Admin" />
                                    <CreateEvent />
                                </>
                            }
                        />
                        <Route
                            path="/events/update"
                            element={
                                <>
                                    <PageTitle title="Update Event | TechXetra Admin" />
                                    <Update />
                                </>
                            }
                        />
                        <Route
                            path="/users/user"
                            element={
                                <>
                                    <PageTitle title="Event Enrolled | TechXetra Admin" />
                                    <EnrolledEvent />
                                </>
                            }
                        />
                        <Route
                            path="/users/user/byID"
                            element={
                                <>
                                    <PageTitle title="Events Enrolled | TechXetra Admin" />
                                    <UserDetails />
                                </>
                            }
                        />
                    </Route>
                    <Route
                        path="*"
                        element={
                            <>
                                <PageTitle title="404 Error | TechXetra Admin" />
                                <NotFound />
                            </>
                        }
                    />
                </Routes>
            </ErrorBoundary>
        </div>
    )
}

export default App;