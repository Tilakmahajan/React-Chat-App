import { create } from 'zustand';
import { useUserStore } from './UserStore';

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    
    ChangeChat: (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser;

        // check if current user is blocked
        if (user.blocked.includes(currentUser.id)) {
            return set({
                chatId,
                user: null,
                iscurrentUserBlocked: true,
                isReceiverBlocked: false,
            });
        }

        // check if current user is blocked
        else if (currentUser.blocked.includes(user.id)) {
            return set({
                chatId,
                user: user,
                iscurrentUserBlocked: false,
                isReceiverBlocked: true,
            });
        }
else{

    set({
        chatId,
        user: user,
        iscurrentUserBlocked: false,
        isReceiverBlocked: false,
    });

}

},

    changeBlock: () => {
        set(state => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
    },
}));
