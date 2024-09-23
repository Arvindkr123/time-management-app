const data = {
  _id: {
    $oid: "66f1011e6e89e3f3c42e6f94",
  },
  ClassName: "1st Class",
  sectionName: "A",
  classSchedules: [
    {
      classDay: "Monday",
      schedule: [
        {
          classTime: "10:00 AM",
          subjectName: "English",
          teacherName: "Ram Singh",
          _id: {
            $oid: "66f1011f6e89e3f3c42e6f96",
          },
        },
        {
          classTime: "11:01",
          subjectName: "Math",
          teacherName: "Ram Singh",
          _id: {
            $oid: "66f101be6e89e3f3c42e6fb0",
          },
        },
        {
          classTime: "12:00 AM",
          subjectName: "HomeScience",
          teacherName: "Ram Singh",
          _id: {
            $oid: "66f1039c6e89e3f3c42e6fee",
          },
        },
        {
          classTime: "11:00",
          subjectName: "HomeScience",
          teacherName: "Ram Singh",
          _id: {
            $oid: "66f107116e89e3f3c42e702c",
          },
        },
      ],
      _id: {
        $oid: "66f1011f6e89e3f3c42e6f95",
      },
    },
    {
      classDay: "Tuesday",
      schedule: [
        {
          classTime: "10:00 AM",
          subjectName: "English",
          teacherName: "Ram Singh",
          _id: {
            $oid: "66f109e66e89e3f3c42e7191",
          },
        },
      ],
      _id: {
        $oid: "66f109e66e89e3f3c42e7190",
      },
    },
  ],
  createdAt: {
    $date: "2024-09-23T05:48:15.052Z",
  },
  updatedAt: {
    $date: "2024-09-23T06:25:42.035Z",
  },
  __v: 4,
};

function ShowCLassTimeTableData() {
  return (
    <table>
      <thead>
        <tr>
          <th>Class</th>
          <th>Section</th>
          <th>Day</th>
          <th>Time</th>
          <th>Subject</th>
          <th>Teacher</th>
        </tr>
      </thead>
      <tbody>
        {data.classSchedules?.map((schedule, index) =>
          schedule.schedule?.map((item, innerIndex) => (
            <tr key={`${index}-${innerIndex}`}>
              <td>{data.ClassName}</td>
              <td>{data.sectionName}</td>
              <td>{schedule.classDay}</td>
              <td>{item.classTime}</td>
              <td>{item.subjectName}</td>
              <td>{item.teacherName}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default ShowCLassTimeTableData;
