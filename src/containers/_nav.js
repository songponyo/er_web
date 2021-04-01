import React from "react";
import CIcon from "@coreui/icons-react";

let awsss = [
  {
    _tag: "CSidebarNavTitle",
    _children: ["Sale"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "ใบสั่งซื้อ (Customer PO)",
    to: "/customer-po",
    icon: "cil-file",
  },
  {
    _tag: "CSidebarNavItem",
    name: "ใบเสนอราคา (Quotation)",
    to: "/quotation",
    icon: "cil-file",
  },
  {
    _tag: "CSidebarNavItem",
    name: "ใบสั่งขาย (Slae Order)",
    to: "/slae-order",
    icon: "cil-file",
  },
  {
    _tag: "CSidebarNavItem",
    name: "ใบส่งสินค้า (Invoice)",
    to: "/invoice",
    icon: "cil-file",
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["Purchase"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "ใบขอซื้อ (PR)",
    to: "/purchase-request",
    icon: "cil-file",
  },
  {
    _tag: "CSidebarNavItem",
    name: "ใบสั่งซื้อ (PO)",
    to: "/purchase-order",
    icon: "cil-file",
  },
  {
    _tag: "CSidebarNavItem",
    name: "จ่ายเงินมัดจำ",
    to: "/purchase-deposit",
    icon: "cil-file",
  },
  {
    _tag: "CSidebarNavItem",
    name: "ใบรับสินค้า (RR)",
    to: "/invoice-supplier",
    icon: "cil-file",
  },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "ใบรับลดหนี้/ส่งคืนสินค้า",
  //   to: "/credit-note-supplier",
  //   icon: "cil-file",
  // },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "ใบรับเพิ่มหนี้",
  //   to: "/debit-note-supplier",
  //   icon: "cil-file",
  // },
  // {
  //   _tag: "CSidebarNavTitle",
  //   _children: ["Production"],
  // },
  {
    _tag: "CSidebarNavTitle",
    _children: ["Stock"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "คลังสินค้า",
    to: "/stock-group",
    icon: "cil-box",
  },
  {
    _tag: "CSidebarNavItem",
    name: "ย้ายคลังสินค้า",
    to: "/stock-move",
    icon: "cil-box",
  },

  // {
  //   _tag: "CSidebarNavTitle",
  //   _children: ["Account"],
  // },
  // {
  //   _tag: "CSidebarNavTitle",
  //   _children: ["Report"],
  // },
  {
    _tag: "CSidebarNavTitle",
    _children: ["MASTER DATA"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "ผู้ขาย ( Supplier )",
    to: "/supplier",
    icon: "cil-file",
  },
  {
    _tag: "CSidebarNavItem",
    name: "ลูกค้า ( Customer ) ",
    to: "/customer",
    icon: "cil-voice-over-record",
  },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "สินค้า  ( Product )",
  //   to: "/product",
  //   icon: "cil-image",
  // },
  {
    _tag: "CSidebarNavItem",
    name: "ผู้ใช้งาน ( User )",
    to: "/user",
    icon: "cil-user",
  },
  {
    _tag: "CSidebarNavItem",
    name: "สิทธิการใช้งาน ( License )",
    to: "/license",
    icon: "cil-user",
  },
  {
    _tag: "CSidebarNavItem",
    name: "วัตถุดิบ ( Product )",
    to: "/material",
    icon: "cil-inbox",
  },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "ประเภทวัตถุดิบ ( Product Type )",
  //   to: "/material-type",
  //   icon: "cil-inbox",
  // },
  {
    _tag: "CSidebarNavItem",
    name: "สี ( Color )",
    to: "/color",
    icon: "cil-box",
  },
  {
    _tag: "CSidebarNavItem",
    name: "กระบวนการผลิต",
    to: "/process",
    icon: "cil-box",
  },
  {
    _tag: "CSidebarNavItem",
    name: "ประเภทกระบวนการผลิต",
    to: "/process-type",
    icon: "cil-box",
  },
  {
    _tag: "CSidebarNavItem",
    name: "ประเภทงาน(สินค้า)",
    to: "/print-type",
    icon: "cil-box",
  },
  {
    _tag: "CSidebarNavItem",
    name: "ไดคัท",
    to: "/die-Cut",
    icon: "cil-box",
  },
  {
    _tag: "CSidebarNavItem",
    name: "เครื่องจักร",
    to: "/machine",
    icon: "cil-box",
  },
  {
    _tag: "CSidebarNavItem",
    name: "ประเภทเครื่องจักร",
    to: "/machine-type",
    icon: "cil-box",
  },
];

export default awsss;
