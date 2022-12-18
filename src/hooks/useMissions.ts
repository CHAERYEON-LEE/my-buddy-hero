import { selector, useRecoilValue, useSetRecoilState, atom } from 'recoil';
import { missionListState, userState } from '@/states';
import axios from 'axios';
import { useHeroes } from '@/hooks';

export const useMissions = () => {
  const user = useRecoilValue(userState);
  const groupId = user.groupId as string;

  const { updateCompleteNumber } = useHeroes();

  const setMissions = useSetRecoilState(missionListState);

  const initMissions = async () => {
    try {
      const { data } = await axios.get(`api/missions/${groupId}`);
      setMissions(data.body.missions);
    } catch (err) {
      console.error(err);
    }
  };

  const addMission = async (mission: Mission) => {
    try {
      const { data } = await axios.post('api/missions', {
        ...mission,
        groupId,
      });
      const newMission = data.body.mission;

      setMissions((prev) => [newMission, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateMission = async (
    missionId: string,
    missionInfo: {
      receiver?: string;
      receivers?: string[];
    }
  ) => {
    try {
      await axios.patch(`api/missions/mission/${missionId}`, missionInfo);

      const { receiver, receivers } = missionInfo;

      if (receiver) {
        setMissions((prevMissions) =>
          prevMissions.map((prevMission) =>
            prevMission.id === missionId
              ? {
                  ...prevMission,
                  receivers: [...prevMission.receivers, receiver],
                }
              : prevMission
          )
        );
      }
      if (receivers) {
        setMissions((prevMissions) =>
          prevMissions.map((prevMission) =>
            prevMission.id === missionId
              ? { ...prevMission, isComplete: true }
              : prevMission
          )
        );
        updateCompleteNumber(receivers);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return { initMissions, addMission, updateMission };
};
