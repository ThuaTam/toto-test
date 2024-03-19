async function createTask(data, token) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "title": "cawt html",
        "description": "cawt html",
        "status": "todo",
        "date": "2024-03-16T15:27:09.536Z",
        "user": "65f5ba4e9fd7a92b06a5dff1"
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: "follow"
    };

    const response = await fetch("http://localhost:3001/api/tasks", requestOptions);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log(result);
    // Xử lý kết quả ở đây nếu cần
}
async function updateTask(taskId, data, token) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");


    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: "follow"
    };

    const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, requestOptions);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log(result);
    // Xử lý kết quả ở đây nếu cần
}
async function getAllTask(token, userId) {

    if (!token || !userId) {
        console.log('Token or userId is missing');
        return;
    }
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': token
        },
        redirect: 'follow'
    };

    try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}/tasks`, requestOptions);
        const result = await response.json();
        return result
    } catch (error) {
        console.error(error);
        return result
    }
};
async function deleteTask(taskId, token) {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token
        },
        redirect: "follow"
    };

    try {
        const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, requestOptions);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};

async function updateUser(userId, data, token) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");


    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: "follow"
    };

    const response = await fetch(`http://localhost:3001/api/users/${userId}`, requestOptions);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log(result);
    // Xử lý kết quả ở đây nếu cần
}
async function getUserById(token, userId) {

    if (!token || !userId) {
        console.log('Token or userId is missing');
        return;
    }
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': token
        },
        redirect: 'follow'
    };

    try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}`, requestOptions);
        const result = await response.json();
        return result
    } catch (error) {
        console.error(error);
        return result
    }
};
async function findTask(token, userId, data) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "title": "Task 2",
        "status": "Pending"
    });

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };
    let url = `http://localhost:3001/api/users/${userId}/filterTask?`;
    console.log(data)
    if (data?.title) {
        url += `title=${data?.title}&`;
    }

    if (data?.status) {
        url += `status=${data?.status}&`;
    }

    try {
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        return result
    } catch (error) {
        console.error(error);
    }
};
const createUser = async (data) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: "follow"
    };

    try {
        const response = await fetch("http://localhost:3001/api/users", requestOptions);
        if (response.ok) {
            const result = await response.json();
            return {error : false, message:"Create user successfully"}
          } else {
            // Nếu status code là 4xx hoặc 5xx, trả về true và thông báo lỗi
            const errorMessage = await response.json();
            console.error("Request failed with status:", response.status, errorMessage);
            return { error: true, message: `${errorMessage?.message}` };
          }
    } catch (error) {
        console.error(error);
    }
};
const isValidEmail = (email) => {
    // Biểu thức chính quy để kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

export { createTask, updateTask, getAllTask, deleteTask, updateUser, getUserById, findTask, createUser , isValidEmail };