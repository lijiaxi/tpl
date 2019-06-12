
<style lang="stylus" scoped>
.filter-item {
  margin-right: 10px;
}

.filter-iteam1 {
  margin-right: 40px;
}

.dialog-footer {
  text-align: center;
}

/deep/ {
  .el-dialog__header {
    text-align: center;
  }
}

.preview-img {
  max-width: 100%;
}

.icon-drag {
  cursor: move;
}
</style>

<template>
  <div class="app-container calendar-list-container">
    <!-- filter 条件查询 -->
    <div class="filter-container">
      <el-form label-width="100px" inline label-position="left">
        <el-form-item label="标题：">
          <el-input
            clearable
            @keyup.enter.native="handleFilter"
            v-model="listQuery.title"
            style="width: 200px;"
            class="filter-item"
            maxlength="20"
            placeholder="标题"
          />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select
            clearable
            v-model="listQuery.status"
            filterable
            class="filter-item"
            placeholder="请选择状态"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期：">
          <el-date-picker
            v-model="listQuery.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期：">
          <el-date-picker
            v-model="listQuery.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <!-- <el-button
        class="filter-item"
      icon="el-icon-circle-plus-outline" v-waves @click="beforOpenDialog(1)" type="primary">新增</el-button>-->
      <el-button
        class="filter-item"
        type="primary"
        v-waves
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        :loading="downloadLoading"
        type="primary"
        v-waves
        icon="el-icon-refresh"
        @click="onRefreash"
      >刷新</el-button>
    </div>
    <!-- table 表格 -->
    <el-table
      :data="list"
      v-loading="loading.list"
      element-loading-text="给我一点时间~"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="index" prop="index"/>
      <el-table-column align="center" label="标题" prop="title"/>
      <el-table-column align="center" label="业务编号" prop="leaseNo"/>
      <el-table-column align="center" label="小区名称" prop="communityName"/>
      <el-table-column align="center" label="地址" prop="address"/>
      <el-table-column align="center" label="楼层" prop="floor"/>
      <el-table-column align="center" label="描述" prop="description"/>
      <el-table-column align="center" label="家居" prop="furniture"/>
      <el-table-column align="center" label="租赁价格" prop="price"/>
      <el-table-column align="center" label="结构" prop="structure"/>
      <el-table-column align="center" label="面积" prop="acreage"/>

      <el-table-column align="center" label="发布人姓名" prop="name"/>
      <el-table-column align="center" label="发布人手机" prop="phone"/>

      <el-table-column align="center" label="发布时长" prop="onlineTime"/>
      <el-table-column align="center" label="付款方式" prop="payType"/>
      <el-table-column align="center" label="审核状态" width="130">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="info">审核中</el-tag>
          <el-tag v-else-if="scope.row.status == 2" type="success">已通过</el-tag>
          <el-tag v-else-if="scope.row.status == 3" type="danger">已驳回</el-tag>
          <el-tag v-else type="warning">已过期/已停止</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布状态" width="130">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.isRelease === 1">未发布/下架</el-tag>
          <el-tag v-else>上架</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="房源详情">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-view" @click="beforeView(scope.row.imagesUrl)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="ctime"/>
      <el-table-column align="center" label="审核时间" prop="utime"/>
      <el-table-column align="center" label="操作" width="480">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" @click="beforOpenDialog(2, scope.row)" type="primary">编辑</el-button>
          <el-button
            icon="el-icon-open"
            type="warning"
            @click="updateItem(scope.row.id, 1)"
            v-if="scope.row.isRelease === 2"
          >下架</el-button>
          <el-button
            icon="el-icon-turn-off"
            type="primary"
            @click="updateItem(scope.row.id, 2)"
            v-else
          >上架</el-button>
          <el-button
            icon="el-icon-document-checked"
            @click="handleItem(scope.row.id, 2)"
            type="primary"
          >通过</el-button>
          <el-button
            icon="el-icon-document-checked"
            @click="handleItem(scope.row.id, 3)"
            type="warning"
          >驳回</el-button>
          <el-button icon="el-icon-delete" @click="deleteItem(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.offset"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog v-dragDialog :title="diglogTitle" :visible.sync="dialog.add">
      <el-form :model="addQuery" status-icon ref="ruleForm" label-width="100px">
        <el-form-item label="发布时长" prop="onlineTime">
          <el-radio-group v-model="addQuery.onlineTime">
            <el-radio :label="7">7天</el-radio>
            <el-radio :label="15">15天</el-radio>
            <el-radio :label="30">30天</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading.add"
            @click="addtem"
          >确定{{dialogType === 1 ? '添加' : '编辑'}}</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="房源详情" v-dragDialog :visible.sync="dialog.view">
      <div style="text-align:center">
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="(item, index) in imgUrl" :key="index">
            <img class="preview-img" :src="item">
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tableMixins from "@/mixins/table";
import * as api from "@/service/house";
export default {
  mixins: [tableMixins],
  name: "house",
  data() {
    return {
      total: 0,
      list: null,
      dialogType: 1,
      imgUrl: [],
      listQuery: {
        status: "",
        title: "",
        startTime: "",
        endTime: ""
      },
      loading: {
        list: false,
        add: false,
        download: false
      },
      dialog: {
        add: false,
        view: false
      },
      addQuery: {
        onlineTime: 7
      },
      fileList: [],
      options: [
        {
          label: "审核中",
          value: 1
        },
        {
          label: "已通过",
          value: 2
        },
        {
          label: "已驳回",
          value: 3
        },
        {
          label: "已过期/已停止",
          value: 4
        }
      ]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    beforeView(url) {
      this.imgUrl = url.split(",");
      this.dialog.view = true;
    },
    async fetchData() {
      try {
        this.loading.list = true;
        const { data } = await api.getList(this.listQuery);
        this.list = data.records.map((item, index) => {
          return {
            ...item,
            index: index + 1
          };
        });
        this.total = data.total;
        this.loading.list = false;
      } catch (error) {
        this.loading.list = false;
      }
    },
    deleteItem(id) {
      const h = this.$createElement;
      this.$msgbox({
        title: "提示",
        message: h("p", null, [h("span", null, "确定删除吗?")]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            try {
              await api.deleteItem({ id });
              this.$message({
                type: "success",
                message: "删除成功"
              });
              instance.confirmButtonLoading = false;
              done();
              this.fetchData();
            } catch (error) {
              done();
              instance.confirmButtonLoading = false;
            }
          } else {
            done();
          }
        }
      });
    },
    updateItem(id, status) {
      const msg = status === 1 ? "确定下架?" : "确定上架?";
      const h = this.$createElement;
      this.$msgbox({
        title: "提示",
        message: h("p", null, [h("span", null, msg)]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            try {
              await api.disItem({ id });
              this.$message({
                type: "success",
                message: "操作成功"
              });
              instance.confirmButtonLoading = false;
              done();
              this.fetchData();
            } catch (error) {
              done();
              instance.confirmButtonLoading = false;
            }
          } else {
            done();
          }
        }
      });
    },
    handleItem(id, status) {
      const msg = status === 2 ? "确定通过?" : "确定驳回?";
      const h = this.$createElement;
      this.$msgbox({
        title: "提示",
        message: h("p", null, [h("span", null, msg)]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            try {
              await api.handleItem({ id, status });
              this.$message({
                type: "success",
                message: "操作成功"
              });
              instance.confirmButtonLoading = false;
              done();
              this.fetchData();
            } catch (error) {
              done();
              instance.confirmButtonLoading = false;
            }
          } else {
            done();
          }
        }
      });
    },
    addtem() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          try {
            this.loading.add = true;
            if (this.dialogType === 1) {
              await api.addtem(this.addQuery);
            } else {
              await api.updateItem(this.addQuery);
            }
            this.$message.success("操作成功");
            this.dialog.add = false;
            this.loading.add = false;
            this.resetForm();
            this.fetchData();
          } catch (error) {
            this.loading.add = false;
          }
        } else {
          return false;
        }
      });
    },
    resetForm(flag) {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      if (flag) {
        this.addQuery = {
          title: "",
          url: "",
          priority: 1
        };
        this.fileList = [];
      }
    },
    beforOpenDialog(type, item) {
      if (type === 1) {
        this.resetForm(1);
      } else {
        this.resetForm();
        const { id, onlineTime } = item;
        this.addQuery = { ...this.addQuery, id, onlineTime };
      }
      this.dialogType = type;
      this.dialog.add = true;
    }
  },
  computed: {
    diglogTitle() {
      return this.dialogType === 1 ? "新增轮播图" : "编辑发布时长";
    }
  }
};
</script>
