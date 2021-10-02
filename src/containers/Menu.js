

const accessMenu = ({PERMISSIONS}) => {  
    // console.log("PERMISSIONS",PERMISSIONS);  
    const navigations = [] 
    const masters = [] 
    const teacher = []
    const students = [] 
    //====================================================== Teacher Classroom =========================================================//

    teacher.push({
        _tag: "CSidebarNavItem",
        name: "กลุ่มเรียน",
        to: "/class-group",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
        // badge: {
        //     color: 'danger',
        //     text: 10,
        // },
    })
    teacher.push({
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

    teacher.push({
        _tag: "CSidebarNavItem",
        name: "เช็คชื่อ",
        to: "/checkin-teacher",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
        // badge: {
        //     color: 'danger',
        //     text: 10,
        // },
    })
    teacher.push({
        _tag: "CSidebarNavItem",
        name: "ข้อมูลส่วนตัว",
        to: "/profile",
        icon: <i className="c-sidebar-nav-icon fa fa-user" />,
        exact: false,
    })


      //====================================================== Student Classroom =========================================================//

     
      students.push({
        _tag: "CSidebarNavItem",
        name: "รายวิชาทั้งหมด",
        to: "/course-student",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
        // badge: {
        //     color: 'danger',
        //     text: 10,
        // },
    })

      students.push({
        _tag: "CSidebarNavItem",
        name: "รายวิชาของฉัน",
        to: "/class-student",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
        // badge: {
        //     color: 'danger',
        //     text: 10,
        // },
    })
    students.push({
        _tag: "CSidebarNavItem",
        name: "ใบลา",
        to: "/leave-student",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
        // badge: {
        //     color: 'danger',
        //     text: 10,
        // },
    })

    students.push({
        _tag: "CSidebarNavItem",
        name: "เช็คชื่อ",
        to: "/checkin-student",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
        // badge: {
        //     color: 'danger',
        //     text: 10,
        // },
    })
    students.push({
        _tag: "CSidebarNavItem",
        name: "ข้อมูลส่วนตัว",
        to: "/profile",
        icon: <i className="c-sidebar-nav-icon fa fa-user" />,
        exact: false,
    })


    //====================================================== Menu MASTER DATA =========================================================//

    masters.push({
        _tag: "CSidebarNavItem",
        name: "ข้อมูลส่วนตัว",
        to: "/profile",
        icon: <i className="c-sidebar-nav-icon fa fa-user" />,
        exact: false,
    })
    masters.push({
        _tag: "CSidebarNavItem",
        name: "ผู้ใช้งานระบบ",
        to: "/user",
        icon: <i className="c-sidebar-nav-icon fa fa-user" />,
        exact: false,
    }) 
    masters.push({
        _tag: "CSidebarNavItem",
        name: "คำนำหน้า",
        to: "/prefix",
        icon: <i className="c-sidebar-nav-icon fa fa-user" />,
        exact: false,
    }) 
    masters.push({
        _tag: "CSidebarNavItem",
        name: "รายวิชา",
        to: "/subject",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
    }) 
    masters.push({
        _tag: "CSidebarNavItem",
        name: "ผู้สมัครเข้าเว็บ",
        to: "/user-register",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
    })
    masters.push({
        _tag: "CSidebarNavItem",
        name: "กลุ่มเรียน",
        to: "/all-class",
        icon: <i className="c-sidebar-nav-icon fa fa-file-text-o" />,
        exact: false,
    })

    //===========================================================================================================================//

    if (students.length  && PERMISSIONS == 0) {
        navigations.push(
            {
                _tag: "CSidebarNavTitle",
                _children: ["Student"],
            },
            ...students,
        )
    }

    if (teacher.length  && PERMISSIONS == 1) {
        navigations.push(
            {
                _tag: "CSidebarNavTitle",
                _children: ["Teacher"],
            },
            ...teacher,
        )
    }
    
    if (masters.length && PERMISSIONS == 2) {
        navigations.push(
            {
                _tag: "CSidebarNavTitle",
                _children: ["General"],
            },
            ...masters,
        )
    }

    return navigations
}

export default accessMenu