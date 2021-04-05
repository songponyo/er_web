const accessMenu = ({ PERMISSIONS, notifications = [] }) => {
    const navigations = []
    const masters = []
    const classrooms = []
    const stocks = []
    //====================================================== Menu Classroom =========================================================//

    classrooms.push({
        _tag: "CSidebarNavItem",
        name: "กลุ่มเรียน",
        to: "/purchase-request",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
        // badge: {
        //     color: 'danger',
        //     text: 10,
        // },
    })
    classrooms.push({
        _tag: "CSidebarNavItem",
        name: "ใบลา",
        to: "/leave-form",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
        // badge: {
        //     color: 'danger',
        //     text: 10,
        // },
    })

    classrooms.push({
        _tag: "CSidebarNavItem",
        name: "เช็คชื่อ",
        to: "/purchase-order",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
        // badge: {
        //     color: 'danger',
        //     text: 10,
        // },
    })


    //====================================================== Menu Stocks =========================================================//

    // stocks.push({
    //     _tag: "CSidebarNavItem",
    //     name: "คลังสินค้า",
    //     to: "/stock-group",
    //     icon: <i className="c-sidebar-nav-icon fa fa-cubes" />,
    //     exact: false,
    // })

    // stocks.push({
    //     _tag: "CSidebarNavItem",
    //     name: "ย้ายคลังสินค้า",
    //     to: "/stock-move",
    //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
    //     exact: false,
    //     // badge: {
    //     //     color: 'danger',
    //     //     text: 10,
    //     // },
    // })

    // stocks.push({
    //     _tag: "CSidebarNavItem",
    //     name: "เบิกสินค้า",
    //     to: "/stock-issue",
    //     icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
    //     exact: false,
    // })

    // stocks.push({
    //     _tag: "CSidebarNavItem",
    //     name: "เปลี่ยนสินค้า",
    //     to: "/stock-change",
    //     icon: <i className="c-sidebar-nav-icon fa fa-exchange" />,
    //     exact: false,
    // })





    //====================================================== Menu MASTER DATA =========================================================//

    masters.push({
        _tag: "CSidebarNavItem",
        name: "ผู้ใช้งานระบบ",
        to: "/user",
        icon: <i className="c-sidebar-nav-icon fa fa-user" />,
        exact: false,
    })
    masters.push({
        _tag: "CSidebarNavItem",
        name: "สิทธิการใช้งาน",
        to: "/license",
        icon: <i className="c-sidebar-nav-icon fa fa-user" />,
        exact: false,
    })


    masters.push({
        _tag: "CSidebarNavItem",
        name: "รายวิชา",
        to: "/course",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
    })


    //===========================================================================================================================//

    if (classrooms.length) {
        navigations.push(
            {
                _tag: "CSidebarNavTitle",
                _children: ["Class room"],
            },
            ...classrooms,
        )
    }
    // if (stocks.length) {
    //     navigations.push(
    //         {
    //             _tag: "CSidebarNavTitle",
    //             _children: ["Stock"],
    //         },
    //         ...stocks,
    //     )
    // }
    if (masters.length) {
        navigations.push(
            {
                _tag: "CSidebarNavTitle",
                _children: ["Master data"],
            },
            ...masters,
        )
    }

    return navigations
}

export default accessMenu