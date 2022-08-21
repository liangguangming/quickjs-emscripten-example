(func $jsvm_newString (;55;) (export "jsvm_newString") (param $var0 i32) (result i32)
    (local $var1 i32) (local $var2 i32)
    global.get $global0
    i32.const 16
    i32.sub
    local.tee $var1
    global.set $global0
    i32.const 71092
    i32.load
    local.set $var2
    local.get $var1
    local.get $var0
    call $func56
    local.get $var2
    local.get $var2
    i32.load offset=44
    local.get $var1
    i32.load
    local.get $var1
    local.get $var1
    i32.load8_u offset=11
    local.tee $var2
    i32.const 24
    i32.shl
    i32.const 24
    i32.shr_s
    i32.const 0
    i32.lt_s
    local.tee $var0
    select
    local.get $var1
    i32.load offset=4
    local.get $var2
    local.get $var0
    select
    call $func210
    call $func15
    local.set $var0
    local.get $var1
    i32.load8_s offset=11
    i32.const -1
    i32.le_s
    if
      local.get $var1
      i32.load
      call $free
    end
    local.get $var1
    i32.const 16
    i32.add
    global.set $global0
    local.get $var0
  )
  (func $func56 (param $var0 i32) (param $var1 i32)
    (local $var2 i32) (local $var3 i32) (local $var4 i32) (local $var5 i32) (local $var6 i32) (local $var7 i32) (local $var8 i32) (local $var9 i32) (local $var10 i32) (local $var11 i32)
    global.get $global0
    i32.const 16
    i32.sub
    local.tee $var9
    global.set $global0
    local.get $var1
    i32.load
    local.set $var6
    local.get $var0
    i32.const 0
    i32.store offset=8
    local.get $var0
    i64.const 0
    i64.store align=4
    global.get $global0
    i32.const 16
    i32.sub
    local.tee $var4
    global.set $global0
    local.get $var4
    local.get $var6
    i32.store offset=12
    block $label3
      block (result i32)
        local.get $var0
        local.set $var2
        local.get $var6
        i32.const -17
        i32.le_u
      end
      if
        local.get $var4
        local.get $var2
        call $func857
        i32.store offset=8
        local.get $var4
        i32.const 12
        i32.add
        local.get $var4
        i32.const 8
        i32.add
        call $func867
        i32.load
        call $func868
        local.tee $var3
        local.get $var2
        call $func858
        i32.ne
        if
          local.get $var3
          local.set $var5
          local.get $var2
          call $func858
          local.set $var7
          local.get $var2
          call $func857
          local.set $var10
          block $label1
            block $label0 (result i32)
              local.get $var3
              i32.const 10
              i32.eq
              if
                i32.const 1
                local.set $var3
                local.get $var2
                local.set $var7
                local.get $var2
                i32.load
                br $label0
              end
              i32.const 0
              local.get $var5
              local.get $var7
              i32.le_u
              local.get $var5
              i32.const 1
              i32.add
              call $func879
              local.tee $var7
              select
              br_if $label1
              local.get $var2
              call $func864
              local.set $var3
              local.get $var2
              call $func859
            end $label0
            local.set $var11
            local.get $var7
            local.get $var11
            local.get $var2
            call $func857
            i32.const 1
            i32.add
            call $func869
            local.get $var3
            if
              local.get $var11
              call $free
            end
            block $label2
              local.get $var5
              i32.const 10
              i32.ne
              if
                local.get $var2
                local.get $var5
                i32.const 1
                i32.add
                call $func871
                local.get $var2
                local.get $var10
                call $func865
                local.get $var2
                local.get $var7
                call $func870
                br $label2
              end
              local.get $var2
              local.get $var10
              call $func866
            end $label2
          end $label1
        end
        local.get $var4
        i32.const 16
        i32.add
        global.set $global0
        br $label3
      end
      call $func855
      unreachable
    end $label3
    local.get $var6
    if
      local.get $var1
      i32.const 4
      i32.add
      local.set $var4
      loop $label5
        local.get $var4
        local.get $var8
        local.tee $var2
        i32.const 1
        i32.shl
        i32.add
        i32.load16_u
        local.set $var3
        block $label4
          local.get $var2
          i32.const 1
          i32.add
          local.tee $var8
          local.get $var6
          i32.ge_u
          br_if $label4
          local.get $var3
          i32.const 55296
          i32.lt_u
          br_if $label4
          local.get $var3
          i32.const 56319
          i32.gt_u
          br_if $label4
          local.get $var4
          local.get $var8
          i32.const 1
          i32.shl
          i32.add
          i32.load16_u
          local.tee $var5
          i32.const 64512
          i32.and
          i32.const 56320
          i32.ne
          br_if $label4
          local.get $var2
          i32.const 2
          i32.add
          local.set $var8
          local.get $var3
          i32.const 10
          i32.shl
          local.get $var5
          i32.add
          i32.const 56613888
          i32.sub
          local.set $var3
        end $label4
        local.get $var0
        local.get $var9
        i32.const 10
        i32.add
        local.get $var9
        i32.const 10
        i32.add
        local.get $var3
        call $func81
        call $func872
        drop
        local.get $var6
        local.get $var8
        i32.gt_u
        br_if $label5
      end $label5
    end
    local.get $var1
    call $free
    local.get $var9
    i32.const 16
    i32.add
    global.set $global0
  )