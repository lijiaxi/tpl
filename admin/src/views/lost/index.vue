
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
</style>

<template>
  <div class="app-container calendar-list-container">
    <!-- filter 条件查询 -->
    <div class="filter-container">
      <el-form label-width="100px" inline label-position="left">
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
      <el-button
        class="filter-item"
        icon="el-icon-circle-plus-outline"
        v-waves
        @click="beforOpenDialog(1)"
        type="primary"
      >新增</el-button>
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
      <el-table-column align="center" label="序号" prop="index"/>
      <el-table-column align="center" label="标题" prop="title"/>
      <el-table-column align="center" label="发布人" prop="name"/>

      <el-table-column align="center" label="是否发布">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.isRelease	 === 1">未发布/下架</el-tag>
          <el-tag v-else>已发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status === 1">未领取</el-tag>
          <el-tag type="success" v-else>已领取</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="ctime"/>
      <el-table-column align="center" label="领取时间" prop="utime"/>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" @click="beforOpenDialog(2, scope.row)" type="primary">编辑</el-button>
          <el-button
            icon="el-icon-document-checked"
            v-if="scope.row.status === 1"
            @click="deleteItem(scope.row.id)"
            type="primary"
          >处理</el-button>
          <el-button
            icon="el-icon-open"
            @click="updateItem(scope.row.id, 2)"
            v-if="scope.row.isRelease === 1"
            type="primary"
          >上架</el-button>
          <el-button
            icon="el-icon-turn-off"
            @click="updateItem(scope.row.id, 1)"
            v-else
            type="warning"
          >下架</el-button>
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
      <el-form :model="addQuery" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input
            type="textarea"
            v-model="addQuery.title"
            style="width:200px"
            clearable
            maxlength="40"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="priority">
          <el-input-number
            v-model="addQuery.priority"
            :step="1"
            :step-strictly="true"
            controls-position="right"
            :min="1"
            :max="99"
          />
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
  </div>
</template>
<script>
import tableMixins from "@/mixins/table";
import * as api from "@/service/lost";
export default {
  mixins: [tableMixins],
  name: "lost",
  data() {
    return {
      total: 0,
      list: null,
      dialogType: 1,
      loading: {
        list: false,
        add: false,
        download: false
      },
      dialog: {
        add: false
      },
      listQuery: {
        status: "",
        startTime: "",
        endTime: ""
      },
      addQuery: {
        title: "",
        priority: 1
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        priority: [
          { required: true, message: "请输入展示顺序", trigger: "blur" }
        ]
      },
      options: [
        {
          label: "未领取",
          value: "1"
        },
        {
          label: "已领取",
          value: "2"
        }
      ]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
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
        message: h("p", null, [h("span", null, "确定处理?")]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            try {
              await api.handleItem({ id });
              this.$message({
                type: "success",
                message: "处理成功"
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
      const msg = status === 1 ? "确定下架?" : "确定发布?";
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
          priority: 1
        };
      }
    },
    beforOpenDialog(type, item) {
      if (type === 1) {
        this.resetForm(1);
      } else {
        this.resetForm();
        const { id, title, priority } = item;
        this.addQuery = { ...this.addQuery, id, title, priority };
      }
      this.dialogType = type;
      this.dialog.add = true;
    }
  },
  computed: {
    diglogTitle() {
      return this.dialogType === 1 ? "新增失误招领公告" : "编辑管理员";
    }
  }
};
</script>
