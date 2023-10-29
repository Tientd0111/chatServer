exports.resConversation = (conversation) => {
    return {
        _id: conversation._id,
        user_1: conversation.user_1,
        user_2: conversation.user_2,
    }
}

exports.resUser = (user) => {
    return {
        _id: user._id,
        name: user.name,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        cover: user.cover,
        date_of_birth: user.date_of_birth,
        email: user.email,
        phone: user.phone_number,
        is_block: user.is_block,
        is_online: user.is_online,
    }
}
exports.resFriend = (friend) => {
    return {
        _id: friend._id,
        sent_form: friend.sent_form,
        arrive: friend.arrive,
        status: friend.status
    }
}
