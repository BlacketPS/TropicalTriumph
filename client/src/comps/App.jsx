import {createBrowserRouter, RouterProvider, useLoaderData} from "react-router-dom";
import {useEffect} from "react";

import NotFoundPage from "./pages/errors/404";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import StatsPage from "./pages/stats/StatsPage";
import DigPage from "./pages/dig/DigPage";
import BazaarPage from "./pages/bazaar/BazaarPage";
import LeaderboardPage from "./pages/leaderboard/LeaderboardPage";
import RewardsPage from "./pages/rewards/RewardsPage";
import LogoutPage from "./pages/logout/LogoutPage";

let router = createBrowserRouter([
    { 
        path: "/*",
        loader: () => ({title: "Not Found"}),
        Component() {
            let props = useLoaderData();

            useEffect(() => {
                document.title = `${props.title === ""
                    ? `Tropical Triumph`
                    : `${props.title} | Tropical Triumph`}`;
            }, [props.title]);

            return (
                <NotFoundPage/>
            ) 
       }
    },
    {
        path: "/",
        loader: () => ({title: ""}),
        Component() {
            let props = useLoaderData();

            useEffect(() => {
                document.title = `${props.title === ""
                    ? `Tropical Triumph`
                    : `${props.title} | Tropical Triumph`}`;
            }, [props.title]);

            return (
                <HomePage/>
            ) 
        }
    },
    {
        path: "/login",
        loader: () => ({title: "Login"}),
        Component() {
            let props = useLoaderData();

            useEffect(() => {   
                document.title = `${props.title === ""
                    ? `Tropical Triumph`
                    : `${props.title} | Tropical Triumph`}`;
            }, [props.title]);

            return (
                <LoginPage/>
            ) 
        }
    },
    {
        path: "/stats",
        loader: () => ({title: "Stats"}),
        Component() {
            let props = useLoaderData();

            useEffect(() => {
                document.title = `${props.title === ""
                    ? `Tropical Triumph`
                    : `${props.title} | Tropical Triumph`}`;
            }, [props.title]);

            return (
                <StatsPage/>
            ) 
        }
    },
    {
        path: "/dig",
        loader: () => ({title: "Dig"}),
        Component() {
            let props = useLoaderData();

            useEffect(() => {
                document.title = `${props.title === ""
                    ? `Tropical Triumph`
                    : `${props.title} | Tropical Triumph`}`;
            }, [props.title]);

            return (
                <DigPage/>
            ) 
        }
    },
    {
        path: "/bazaar",
        loader: () => ({title: "Bazaar"}),
        Component() {
            let props = useLoaderData();

            useEffect(() => {
                document.title = `${props.title === ""
                    ? `Tropical Triumph`
                    : `${props.title} | Tropical Triumph`}`;
            }, [props.title]);

            return (
                <BazaarPage/>
            ) 
        }
    },
    {
        path: "/leaderboard",
        loader: () => ({title: "Leaderboard"}),
        Component() {
            let props = useLoaderData();

            useEffect(() => {
                document.title = `${props.title === ""
                    ? `Tropical Triumph`
                    : `${props.title} | Tropical Triumph`}`;
            }, [props.title]);

            return (
                <LeaderboardPage/>
            ) 
        }
    },
    {
        path: "/rewards",
        loader: () => ({title: "Rewards"}),
        Component() {
            let props = useLoaderData();

            useEffect(() => {
                document.title = `${props.title === ""
                    ? `Tropical Triumph`
                    : `${props.title} | Tropical Triumph`}`;
            }, [props.title]);

            return (
                <RewardsPage/>
            ) 
        }
    },
    {
        path: "/logout",
        loader: () => ({title: ""}),
        Component() {
            let props = useLoaderData();

            useEffect(() => {
                document.title = `${props.title === ""
                    ? `Tropical Triumph`
                    : `${props.title} | Tropical Triumph`}`;
            }, [props.title]);

            return (
                <LogoutPage/>
            )
        }
    },
]);

export default function App() {
    return (
        <RouterProvider router={router} fallbackElement={<p>Loading...</p>}/>
    )
}