import React, { useEffect, useState } from 'react';
import { instance } from '../../api/instance';

const GuildPage = () => {

    const [guild, setGuild] = useState({});

    const servers = [
        '전체월드',
        '리부트2',
        '리부트',
        '오로라',
        '레드',
        '이노시스',
        '유니온',
        '스카니아',
        '루나',
        '제니스',
        '크로아',
        '베라',
        '엘리시움',
        '아케인',
        '노바',
        '버닝',
        '버닝2',
        '버닝3',
    ];

    const get_oguild_id = () => {
        instance.get(`${process.env.REACT_APP_MAPLE_BASE_URL}/maplestory/v1/guild/id?guild_name=${guild.guild_name}&world_name=${guild.world_name}`, {
            headers: {
                "x-nxopen-api-key": process.env.REACT_APP_MAPLE_KEY
            },
        }).then(res => {
            console.log("res", res);
            setGuild({...guild, oguild_id:res.data.oguild_id});
        }).catch(err => {
            console.log("err", err);
        })
    }

    const search_guild = () => {
        instance.get(`${process.env.REACT_APP_MAPLE_BASE_URL}/maplestory/v1/guild/basic?oguild_id=${guild.oguild_id}&date=${guild.date}`, {
            headers: {
                "x-nxopen-api-key": process.env.REACT_APP_MAPLE_KEY
            },
        }).then(res => {
            console.log("res", res);
            setGuild({...guild, guild_info:res.data});
        }).catch(err => {
            console.log("err", err);
        })
    }

    useEffect(() => {
        console.log(guild);
    }, [guild]);

    return (
        <div>
            <select name="world_name" onChange={(e) => setGuild({ ...guild, world_name: e.target.value })}>
                {
                    servers.map(element => (
                        <option key={element} value={element}>{element}</option>
                    ))
                }             
            </select>
            <input type='text' name='guild_name' value={guild.guild_name || ""} onChange={(e) => setGuild({ ...guild, guild_name: e.target.value })} />
            <button onClick={get_oguild_id}>길드 oid가져오기</button>
            <br/>
            <input type='date' name='date' value={guild.date || ""} onChange={(e) => setGuild({ ...guild, date: e.target.value })} />
            <button onClick={search_guild}>길드 정보 조회</button>
        </div>
    );
};

export default GuildPage;