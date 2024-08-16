import Header from "../../global/Header";
import Background from "../../global/Background";
import Sand from "../../global/Sand";
import Loader from "../../global/Loader";
import { useState, useRef, useEffect, } from "react"
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/rewards.scss"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Reward(props) {
    const rewardUrls = {
      Bia: "/content/rewards/Bia.gif",
      "Gold Doubloon": "/content/rewards/Gold Doubloon.gif",
      "Golden Crab": "/content/rewards/Golden Crab.png",
      "Golden Seashell": "/content/rewards/Golden Seashell.gif",
      "Golden Shovel": "/content/rewards/Golden Shovel.png",
      "Treasure Chest": "/content/rewards/Treasure Chest.gif",
      "Tropical Island": "/content/rewards/Tropical Island.gif"
    };
  
    return (
      <div className="reward-container">
        <img draggable={false} style={{
            userSelect: "none",
          }} className="reward-image" alt={props.name} src={rewardUrls[props.name]}></img>
        <div className="reward-name">{props.name}</div>
        <div className="reward-guide">{props.guide}</div>
        <img
          draggable={false}
          style={{
            userSelect: "none",
          }}
          className="reward-status"
          alt="Status"
          src={props.hasReward ? "/content/reward-check.png" : "/content/reward-cross.png"}
        />
      </div>
    );
  }

export default function RewardsPage() {
    const [user, setUser] = useState(useSelector(state => state.user));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const leaderboard = useState({
        leaderboard: [],
        position: 0
    });
    let loaderRef = useRef(null);

    useEffect(() => {
        loaderRef.current.style.display = "flex";
        axios.get("/api/user").then((res) => {
            if (res.data.error) return navigate('/logout');
            setUser(res.data.user);
            dispatch({type: "SET_USER", payload: res.data.user});
            axios.get("/api/leaderboard").then((res) => {
                if (res.data.error) return navigate('/logout');
                leaderboard[1]({
                    leaderboard: res.data.leaderboard,
                    position: res.data.position
                });
                loaderRef.current.style.display = "none";
            });
        });
    }, []);

    /*
    <div className="reward-container">
                    <img className="reward-image" alt="Bia" src="/content/rewards/Bia.gif"></img>
                    <div className="reward-name">Bia</div>
                    <div className="reward-guide">Be the first to collect all treasures.</div>
                    <img className="reward-status" alt="Status" src={
                        leaderboard[0].position <= 1 && Object.values(user.treasures).flatMap(category => Object.keys(category).filter(treasure => category[treasure] > 0)).length >= 35 ? "/content/reward-check.png"
                        : "/content/reward-cross.png"
                    }></img>
                </div>
                */
    return (
        <>
            <Header/>
            <Background/>
            <Sand/>
            <Loader ref={loaderRef}/>

            <div className="rewards-title">Rewards</div>
            <div className="rewards-subtitle">Unlocked rewards will be added to your Blacket account once the event has ended.</div>

            <div className="rewards-container">
                <Reward name="Bia" guide="Be the first to collect all treasures." hasReward={leaderboard[0].position <= 1 && Object.values(user.treasures).flatMap(category => Object.keys(category).filter(treasure => category[treasure] > 0)).length >= 35}/>

                <Reward name="Tropical Island" guide="Be the second to collect all treasures." hasReward={leaderboard[0].position <= 2 && Object.values(user.treasures).flatMap(category => Object.keys(category).filter(treasure => category[treasure] > 0)).length >= 35}/>
                
                <Reward name="Gold Doubloon" guide="Be the third to collect all treasures." hasReward={leaderboard[0].position <= 3 && Object.values(user.treasures).flatMap(category => Object.keys(category).filter(treasure => category[treasure] > 0)).length >= 35}/>

                <Reward name="Golden Seashell" guide="Be in the top 10 to collect all treasures." hasReward={leaderboard[0].position <= 10 && Object.values(user.treasures).flatMap(category => Object.keys(category).filter(treasure => category[treasure] > 0)).length >= 35}/>

                <Reward name="Golden Crab" guide="Be in the top 25 to collect all treasures." hasReward={leaderboard[0].position <= 25 && Object.values(user.treasures).flatMap(category => Object.keys(category).filter(treasure => category[treasure] > 0)).length >= 35}/>

                <Reward name="Treasure Chest" guide="Collect over 1 million shells." hasReward={user.shells >= 1000000}/>
                
                <Reward name="Golden Shovel" guide="Collect all treasures." hasReward={Object.values(user.treasures).flatMap(category => Object.keys(category).filter(treasure => category[treasure] > 0)).length >= 35}/>
            </div>

        </>
    )
}