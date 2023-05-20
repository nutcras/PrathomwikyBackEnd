const validate_req = require('../models/validate_req.models')
const database = require('../models/query_code')
const {v4: uuidv4} = require('uuid');

exports.create = async (req, res) => {
  // ดึงข้อมูลจาก request
  const {
    videoname,
    videolink,
    videodesc,
    typeId,
    adminId,
    listDetail
  } = req.body
  if (validate_req(req, res, [videoname, videolink, typeId, listDetail,  adminId])) return
  const videoId = uuidv4();
  // คำสั่ง SQL
  const sql = `INSERT INTO video (videoId, videoname, videolink, videodesc, typeId, adminId)
  VALUES ($1, $2, $3, $4, $5, $6);`;
const values = [videoId, videoname, videolink, videodesc, typeId, adminId];

await database.create(sql, values, async (err, data) => {
  if (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred.',
    });
  } else {
    // data.token = await sign({ id: data.id }, '3d');  
    listDetail.map(async (m)=>{
      const sql1 = `INSERT INTO videodetail (videoId, tagId)
      VALUES ($1, $2);`;
      const values1 = [videoId, m.tagId]

      await database.create(sql1, values1, async (err, data) => {
        if (err) {
          res.status(500).send({
            message: err.message || 'Some error occurred.',
          });
        }
      });
    })
    res.send("create success")
  }
});

}

exports.findAll = async (req, res) => {
  // คำสั่ง SQL
  const sql = `
    SELECT v.*, vd.vdid, vd.tagid
    FROM video v
    LEFT JOIN videodetail vd ON vd.videoId = v.videoId
    ORDER BY v.videoId ASC;
  `;
  
  // ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await database.get(sql, (err, data) => {
    if (err) {
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      });
    } else if (data) {
      const videos = [];

      // Grouping the video details by videoid
      const videoDetailsMap = new Map();
      for (const row of data.rows) {
        const { videoid, videoname, videolink, videodesc, typeid, adminid, vdid, tagid } = row;
        
        if (!videoDetailsMap.has(videoid)) {
          videoDetailsMap.set(videoid, []);
        }
        
        const videoDetail = { vdid, tagid };
        videoDetailsMap.get(videoid).push(videoDetail);
        
        if (!videos.some((video) => video.videoid === videoid)) {
          const video = { videoid, videoname, videolink, videodesc, typeid, adminid };
          videos.push(video);
        }
      }
      
      // Adding video details to respective videos
      for (const video of videos) {
        const videoid = video.videoid;
        if (videoDetailsMap.has(videoid)) {
          video.videoDetail = videoDetailsMap.get(videoid);
        }
      }
      
      res.status(200).json(videos);
    } else {
      res.status(204).end();
    }
  });
}

exports.findByType = async (req, res) => {
  const { typeId } = req.params;

  // คำสั่ง SQL
  const sql = `
    SELECT v.*, vd.vdid, vd.tagid
    FROM video v
    LEFT JOIN videodetail vd ON vd.videoId = v.videoId
    WHERE v.typeId = ${typeId}
    ORDER BY v.videoId ASC;`;

  // ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await database.get(sql, (err, data) => {
    if (err) {
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      });
    } else if (data) {
      const videos = [];

      // Grouping the video details by videoid
      const videoDetailsMap = new Map();
      for (const row of data.rows) {
        const { videoid, videoname, videolink, videodesc, typeid, adminid, vdid, tagid } = row;

        if (!videoDetailsMap.has(videoid)) {
          videoDetailsMap.set(videoid, []);
        }

        const videoDetail = { vdid, tagid };
        videoDetailsMap.get(videoid).push(videoDetail);

        if (!videos.some((video) => video.videoid === videoid)) {
          const video = { videoid, videoname, videolink, videodesc, typeid, adminid };
          videos.push(video);
        }
      }

      // Adding video details to respective videos
      for (const video of videos) {
        const videoid = video.videoid;
        if (videoDetailsMap.has(videoid)) {
          video.videoDetail = videoDetailsMap.get(videoid);
        }
      }
      res.status(200).json(videos);
    } else {
      res.status(204).end();
    }
  });
}




exports.findById = async (req, res) => {
  // คำสั่ง SQL
  const { id } = req.params;
  const sql = `SELECT v.*, vd.vdid, vd.tagid
               FROM video v
               LEFT JOIN videodetail vd ON vd.videoId = v.videoId
               WHERE v.videoId = '${id}'`;

  // ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await database.get(sql, (err, data) => {
    if (err) {
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      });
    } else if (data) {
      if (data.rows.length === 0) {
        res.send("NOTFOUND");
      } else {
        const { videoid, videoname, videolink, videodesc, typeid, adminid } = data.rows[0];

        const video = {
          videoid,
          videoname,
          videolink,
          videodesc,
          typeid,
          adminid,
          videoDetail: [],
        };

        for (const row of data.rows) {
          const { vdid, tagid } = row;
          if (vdid && tagid) {
            video.videoDetail.push({ vdid, tagid });
          }
        }

        res.status(200).json(video);
      }
    } else {
      res.status(204).end();
    }
  });
}

exports.update = async (req, res) => {
  // ดึงข้อมูลจาก request
  const {
    videoname,
    videolink,
    videodesc,
    typeId,
    adminId,
    listDetail
  } = req.body;
  // ดึงข้อมูลจาก params
  const { id } = req.params;
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return;
  // คำสั่ง SQL
  const sql = 'UPDATE video SET videoname = $1, videolink = $2, videodesc = $3, adminid = $4, typeId = $5 WHERE videoId = $6';
  // ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?
  const data = [videoname, videolink, videodesc, adminId, typeId, id];
  // แก้ไขข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await database.update(sql, data, async (err) => {
    if (err) {
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      });
    } else {
      const deleteSql = 'DELETE FROM videodetail WHERE videoid = $1';
      const deleteData = [id];

      await database.delete(deleteSql, deleteData, async (err) => {
        if (err) {
          res.status(500).send({
            message: err.message || 'Some error occurred.',
          });
        } else {
          for (const m of listDetail) {
            const insertSql = 'INSERT INTO videodetail (videoId, tagId) VALUES ($1, $2)';
            const insertData = [id, m.tagId];

            await database.create(insertSql, insertData, (err) => {
              if (err) {
                res.status(500).send({
                  message: err.message || 'Some error occurred.',
                });
              }
            });
          }
          
          res.send('UPDATESUCCESS');
        }
      });
    }
  });
};


exports.deleteOne = async (req, res) => {
  // ดึงข้อมูลจาก params
  const { id } = req.params;
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return;

  try {
    // คำสั่ง SQL สำหรับลบจากตาราง videodetail
    const deleteVideoDetailSql = 'DELETE FROM videodetail WHERE videoId = $1';
    const videoDetailData = [id];
    await database.delete(deleteVideoDetailSql, videoDetailData, (err, _) => {
      if (err) {
        res.status(err.status || 500).send({
          message: err.message || 'Some error occurred.',
        });
      } 
    });

    // คำสั่ง SQL สำหรับลบจากตาราง video
    const deleteVideoSql = 'DELETE FROM video WHERE videoId = $1';
    const videoData = [id];
    await database.delete(deleteVideoSql, videoData, (err, _) => {
      if (err) {
        res.status(err.status || 500).send({
          message: err.message || 'Some error occurred.',
        });
      } else {
        res.status(200).send('DELETESUCCESS');
      }
    });
  } catch (err) {
    res.status(err.status || 500).send({
      message: err.message || 'Some error occurred.',
    });
  }
};



